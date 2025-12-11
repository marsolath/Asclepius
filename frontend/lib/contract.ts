export const ASCLEPIUS_ADDRESS = "0x843C78b3341805cf1A8A24979a99074478F086D8" as const;

export const ASCLEPIUS_ABI = [
  {
    inputs: [
      { internalType: "externalEbool", name: "encHivNegative", type: "bytes32" },
      { internalType: "externalEbool", name: "encNoCancer", type: "bytes32" },
      { internalType: "externalEbool", name: "encHepBNegative", type: "bytes32" },
      { internalType: "externalEbool", name: "encNoMentalIllness", type: "bytes32" },
      { internalType: "externalEbool", name: "encNoHeartDisease", type: "bytes32" },
      { internalType: "bytes", name: "inputProof", type: "bytes" },
    ],
    name: "submitVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getVerificationHandle",
    outputs: [
      { internalType: "euint8", name: "countHandle", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "hasVerification",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "VerificationSubmitted",
    type: "event",
  },
] as const;

export const TIER_LABELS = {
  STANDARD: "Standard Coverage",
  SUBSTANDARD: "Substandard Coverage", 
  DECLINED: "Coverage Declined",
} as const;

export const TIER_DESCRIPTIONS = {
  STANDARD: "All health criteria met. Eligible for standard insurance rates.",
  SUBSTANDARD: "Most criteria met. Eligible with adjusted premium.",
  DECLINED: "Multiple criteria not met. Coverage cannot be provided.",
} as const;

// Helper to determine tier from pass count
export function getTierFromPassCount(passCount: number): "standard" | "substandard" | "declined" {
  if (passCount === 5) return "standard";
  if (passCount >= 3) return "substandard";
  return "declined";
}
