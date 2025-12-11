"use client";

let instance: any = null;
let isInitialized = false;
let isInitializing = false;
let initError: string | null = null;

/**
 * Convert Uint8Array to hex string with 0x prefix
 */
export function toHex(arr: Uint8Array): `0x${string}` {
  return `0x${Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Initialize FHEVM SDK
 */
export async function initFhevm(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("FHEVM can only be initialized in browser");
  }
  
  // Ensure global is defined
  if (typeof global === "undefined") {
    (window as any).global = window;
  }
  
  if (instance && isInitialized) return instance;
  if (initError) throw new Error(initError);
  
  // Prevent concurrent initialization
  if (isInitializing) {
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (isInitialized && instance) {
          clearInterval(check);
          resolve(instance);
        }
        if (initError) {
          clearInterval(check);
          reject(new Error(initError));
        }
      }, 100);
    });
  }

  isInitializing = true;

  try {
    // Dynamic import to avoid SSR issues
    const { initSDK, createInstance, SepoliaConfig } = await import("@zama-fhe/relayer-sdk/web");
    
    // thread: 0 disables multithreading to avoid COOP/COEP header issues
    await initSDK({ thread: 0 });
    instance = await createInstance(SepoliaConfig);
    isInitialized = true;
    return instance;
  } catch (error: any) {
    initError = error.message || "Failed to initialize FHEVM";
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * Encrypt boolean values for health verification
 */
export async function encryptHealthData(
  contractAddress: string,
  userAddress: string,
  healthData: {
    hivNegative: boolean;
    noCancer: boolean;
    hepBNegative: boolean;
    noMentalIllness: boolean;
    noHeartDisease: boolean;
  }
): Promise<{ handles: `0x${string}`[]; inputProof: `0x${string}` }> {
  const fhevm = await initFhevm();
  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  
  // Add all 5 boolean values
  input.addBool(healthData.hivNegative);
  input.addBool(healthData.noCancer);
  input.addBool(healthData.hepBNegative);
  input.addBool(healthData.noMentalIllness);
  input.addBool(healthData.noHeartDisease);
  
  const encrypted = await input.encrypt();
  
  return {
    handles: encrypted.handles.map((h: Uint8Array) => toHex(h)),
    inputProof: toHex(encrypted.inputProof),
  };
}

/**
 * User decrypt - decrypt euint8 result using user's private key via EIP-712 signature
 * Uses SDK's userDecrypt with timeout wrapper
 */
export async function userDecryptUint8(
  handle: `0x${string}`,
  contractAddress: string,
  userAddress: string,
  signTypedDataAsync: (params: any) => Promise<`0x${string}`>
): Promise<number> {
  const fhevm = await initFhevm();
  
  const { publicKey, privateKey } = fhevm.generateKeypair();
  
  const startTimestamp = Math.floor(Date.now() / 1000);
  const durationDays = 1;
  
  const eip712 = fhevm.createEIP712(
    publicKey, 
    [contractAddress],
    startTimestamp,
    durationDays
  );
  
  const signature = await signTypedDataAsync({
    domain: eip712.domain,
    types: eip712.types,
    primaryType: eip712.primaryType,
    message: eip712.message,
  });
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Decryption timeout (30s) - Zama relayer not responding")), 30000);
  });
  
  const decryptPromise = fhevm.userDecrypt(
    [{ handle, contractAddress }],
    privateKey,
    publicKey,
    signature,
    [contractAddress],
    userAddress,
    startTimestamp,
    durationDays
  );
  
  const results = await Promise.race([decryptPromise, timeoutPromise]);
  
  const decryptedValue = results[handle] ?? results[handle.toLowerCase()];
  if (decryptedValue === undefined) {
    throw new Error("Decryption returned no result - check Zama relayer status");
  }
  
  return Number(decryptedValue);
}

/**
 * Get FHEVM initialization status
 */
export function getFhevmStatus(): { 
  isReady: boolean; 
  isInitializing: boolean; 
  error: string | null 
} {
  return {
    isReady: isInitialized && instance !== null,
    isInitializing,
    error: initError,
  };
}

/**
 * Reset FHEVM state (for testing)
 */
export function resetFhevm(): void {
  instance = null;
  isInitialized = false;
  isInitializing = false;
  initError = null;
}
