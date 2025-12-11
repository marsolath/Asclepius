import { create } from "zustand";

export type FhevmStatus = "idle" | "initializing" | "ready" | "error";
export type AppPage = "home" | "verify";
export type VerificationStep = "input" | "encrypting" | "submitting" | "decrypting" | "result";
export type ResultTier = "standard" | "substandard" | "declined" | null;

interface HealthData {
  hivNegative: boolean | null;
  noCancer: boolean | null;
  hepBNegative: boolean | null;
  noMentalIllness: boolean | null;
  noHeartDisease: boolean | null;
}

interface AppStore {
  // FHEVM Status
  fhevmStatus: FhevmStatus;
  fhevmError: string | null;
  setFhevmStatus: (status: FhevmStatus) => void;
  setFhevmError: (error: string | null) => void;
  
  // Navigation
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  
  // Verification Flow
  verificationStep: VerificationStep;
  setVerificationStep: (step: VerificationStep) => void;
  
  // Health Data Input
  healthData: HealthData;
  setHealthData: (data: Partial<HealthData>) => void;
  resetHealthData: () => void;
  
  // Result
  resultTier: ResultTier;
  setResultTier: (tier: ResultTier) => void;
  
  // Transaction
  txHash: string | null;
  setTxHash: (hash: string | null) => void;
  
  // Reset all state
  resetAll: () => void;
}

const initialHealthData: HealthData = {
  hivNegative: null,
  noCancer: null,
  hepBNegative: null,
  noMentalIllness: null,
  noHeartDisease: null,
};

export const useAppStore = create<AppStore>((set) => ({
  // FHEVM Status
  fhevmStatus: "idle",
  fhevmError: null,
  setFhevmStatus: (status) => set({ fhevmStatus: status }),
  setFhevmError: (error) => set({ fhevmError: error }),
  
  // Navigation
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Verification Flow
  verificationStep: "input",
  setVerificationStep: (step) => set({ verificationStep: step }),
  
  // Health Data Input
  healthData: initialHealthData,
  setHealthData: (data) => set((state) => ({ 
    healthData: { ...state.healthData, ...data } 
  })),
  resetHealthData: () => set({ healthData: initialHealthData }),
  
  // Result
  resultTier: null,
  setResultTier: (tier) => set({ resultTier: tier }),
  
  // Transaction
  txHash: null,
  setTxHash: (hash) => set({ txHash: hash }),
  
  // Reset all state
  resetAll: () => set({
    currentPage: "home",
    verificationStep: "input",
    healthData: initialHealthData,
    resultTier: null,
    txHash: null,
  }),
}));

