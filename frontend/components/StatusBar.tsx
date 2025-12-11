"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { ASCLEPIUS_ADDRESS } from "@/lib/contract";

export default function StatusBar() {
  const { fhevmStatus, fhevmError } = useAppStore();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenAddress = (addr: string) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") {
      return "Not Deployed";
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getStatusDisplay = () => {
    switch (fhevmStatus) {
      case "idle":
        return { text: "Idle", color: "bg-warmGray-400" };
      case "initializing":
        return { text: "Initializing...", color: "bg-caution" };
      case "ready":
        return { text: "Ready", color: "bg-healing" };
      case "error":
        return { text: "Error", color: "bg-alert" };
      default:
        return { text: "Unknown", color: "bg-warmGray-400" };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-warmGray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* FHEVM Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color} ${fhevmStatus === "initializing" ? "animate-pulse" : ""}`} />
              <span className="text-sm text-warmGray-600">
                FHEVM: <span className="font-medium">{status.text}</span>
              </span>
            </div>

            {/* Contract Address */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-warmGray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <a
                href={`https://sepolia.etherscan.io/address/${ASCLEPIUS_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 font-mono hover:underline"
              >
                {shortenAddress(ASCLEPIUS_ADDRESS)}
              </a>
            </div>
          </div>

          {/* Right side - Wallet */}
          <div className="flex items-center gap-3">
            {/* Error display */}
            {fhevmError && (
              <div className="text-sm text-alert">
                {fhevmError}
              </div>
            )}

            {/* Wallet Address + Disconnect */}
            {isConnected && address && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-warmGray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm text-warmGray-700 font-mono">
                  {shortenAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="ml-1 p-1 rounded-md hover:bg-warmGray-100 text-warmGray-400 hover:text-alert transition-colors"
                  title="Disconnect wallet"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
