"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const { isConnected } = useAccount();
  const { setCurrentPage, fhevmStatus } = useAppStore();

  const handleStart = () => {
    if (isConnected && fhevmStatus === "ready") {
      setCurrentPage("verify");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl w-full text-center"
    >
      {/* Logo / Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl shadow-xl flex items-center justify-center">
          <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-display text-5xl font-semibold text-warmGray-800 mb-4"
      >
        Asclepius
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl text-warmGray-500 mb-12"
      >
        Privacy-First Health Verification
      </motion.p>

      {/* Connect Button or Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        {!isConnected ? (
          <div className="flex flex-col items-center gap-3">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="btn-primary text-lg px-10 py-4"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
            <p className="text-sm text-warmGray-400">
              Connect to Sepolia network to begin
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleStart}
              disabled={fhevmStatus !== "ready"}
              className="btn-primary text-lg px-10 py-4 animate-glow"
            >
              {fhevmStatus === "ready" ? "Begin Verification" : "Initializing..."}
            </button>
          </div>
        )}
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-16 grid grid-cols-3 gap-6"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-healing-light flex items-center justify-center">
            <svg className="w-6 h-6 text-healing-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-medium text-warmGray-700">Encrypted</h3>
          <p className="text-sm text-warmGray-500">Data never exposed</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-medium text-warmGray-700">Verified</h3>
          <p className="text-sm text-warmGray-500">On-chain proof</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-caution-light flex items-center justify-center">
            <svg className="w-6 h-6 text-caution-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-medium text-warmGray-700">Instant</h3>
          <p className="text-sm text-warmGray-500">Real-time results</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
