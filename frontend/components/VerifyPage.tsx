"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import HealthForm from "./HealthForm";
import ProcessingStep from "./ProcessingStep";
import ResultDisplay from "./ResultDisplay";

export default function VerifyPage() {
  const { verificationStep, setCurrentPage, resetAll } = useAppStore();

  const handleBack = () => {
    resetAll();
    setCurrentPage("home");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-warmGray-500 hover:text-warmGray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h2 className="font-display text-2xl font-semibold text-warmGray-800">
          Health Verification
        </h2>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Content based on step */}
      <AnimatePresence mode="wait">
        {verificationStep === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <HealthForm />
          </motion.div>
        )}

        {(verificationStep === "encrypting" || 
          verificationStep === "submitting" || 
          verificationStep === "decrypting") && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProcessingStep />
          </motion.div>
        )}

        {verificationStep === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ResultDisplay />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

