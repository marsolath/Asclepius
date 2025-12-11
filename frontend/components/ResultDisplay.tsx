"use client";

import { motion } from "framer-motion";
import { useAppStore, ResultTier } from "@/store/useAppStore";
import { TIER_LABELS, TIER_DESCRIPTIONS } from "@/lib/contract";

const tierConfig: Record<Exclude<ResultTier, null>, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: JSX.Element;
  label: string;
  description: string;
}> = {
  standard: {
    color: "text-healing-dark",
    bgColor: "bg-healing-light",
    borderColor: "border-healing",
    icon: (
      <svg className="w-16 h-16 text-healing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: TIER_LABELS.STANDARD,
    description: TIER_DESCRIPTIONS.STANDARD,
  },
  substandard: {
    color: "text-caution-dark",
    bgColor: "bg-caution-light",
    borderColor: "border-caution",
    icon: (
      <svg className="w-16 h-16 text-caution" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    label: TIER_LABELS.SUBSTANDARD,
    description: TIER_DESCRIPTIONS.SUBSTANDARD,
  },
  declined: {
    color: "text-alert-dark",
    bgColor: "bg-alert-light",
    borderColor: "border-alert",
    icon: (
      <svg className="w-16 h-16 text-alert" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: TIER_LABELS.DECLINED,
    description: TIER_DESCRIPTIONS.DECLINED,
  },
};

export default function ResultDisplay() {
  const { resultTier, txHash, resetAll, setCurrentPage } = useAppStore();

  if (!resultTier) return null;

  const config = tierConfig[resultTier];

  const handleNewVerification = () => {
    resetAll();
    setCurrentPage("verify");
  };

  const handleBackHome = () => {
    resetAll();
    setCurrentPage("home");
  };

  return (
    <div className="card p-8 text-center">
      {/* Result Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className={`w-24 h-24 mx-auto mb-6 rounded-full ${config.bgColor} flex items-center justify-center`}
      >
        {config.icon}
      </motion.div>

      {/* Result Label */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-2xl font-display font-semibold mb-2 ${config.color}`}
      >
        {config.label}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-warmGray-500 mb-6"
      >
        {config.description}
      </motion.p>

      {/* Verification Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor} mb-6`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-5 h-5 text-warmGray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-medium text-warmGray-700">Verification Complete</span>
        </div>
        <p className="text-sm text-warmGray-500">
          Your health data was verified on-chain without revealing any details
        </p>
      </motion.div>

      {/* Transaction Link */}
      {txHash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Etherscan
          </a>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        <button
          onClick={handleBackHome}
          className="btn-secondary flex-1"
        >
          Back to Home
        </button>
        <button
          onClick={handleNewVerification}
          className="btn-primary flex-1"
        >
          New Verification
        </button>
      </motion.div>
    </div>
  );
}

