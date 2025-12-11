"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

const steps = [
  { 
    id: "encrypting", 
    label: "Encrypting Data", 
    description: "Securing your health information with FHE",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  { 
    id: "submitting", 
    label: "Submitting to Chain", 
    description: "Recording encrypted verification on Sepolia",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  { 
    id: "decrypting", 
    label: "Decrypting Result", 
    description: "Retrieving your verification outcome",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function ProcessingStep() {
  const { verificationStep, txHash } = useAppStore();

  const currentStepIndex = steps.findIndex(s => s.id === verificationStep);

  return (
    <div className="card p-8">
      {/* Progress Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = step.id === verificationStep;
          const isComplete = index < currentStepIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-primary-50 border border-primary-200" 
                  : isComplete 
                    ? "bg-healing-light border border-healing/20"
                    : "bg-warmGray-50 border border-warmGray-100"
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isActive 
                  ? "bg-primary-500 text-white" 
                  : isComplete 
                    ? "bg-healing text-white"
                    : "bg-warmGray-200 text-warmGray-400"
              }`}>
                {isComplete ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className={`font-medium ${
                  isActive ? "text-primary-700" : isComplete ? "text-healing-dark" : "text-warmGray-400"
                }`}>
                  {step.label}
                </h3>
                <p className={`text-sm ${
                  isActive ? "text-primary-500" : isComplete ? "text-healing" : "text-warmGray-400"
                }`}>
                  {step.description}
                </p>
              </div>

              {/* Status */}
              {isActive && (
                <div className="spinner" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Transaction Hash */}
      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-warmGray-50 rounded-xl"
        >
          <p className="text-sm text-warmGray-500 mb-1">Transaction</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-mono text-sm break-all hover:underline"
          >
            {txHash}
          </a>
        </motion.div>
      )}

      {/* Privacy Assurance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-warmGray-500">
          <svg className="w-4 h-4 text-healing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Your data remains encrypted throughout
        </div>
      </motion.div>
    </div>
  );
}

