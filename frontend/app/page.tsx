"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { initFhevm, getFhevmStatus } from "@/lib/fhe";
import HomePage from "@/components/HomePage";
import VerifyPage from "@/components/VerifyPage";
import StatusBar from "@/components/StatusBar";

export default function App() {
  const { isConnected } = useAccount();
  const { currentPage, setFhevmStatus, setFhevmError, resetAll } = useAppStore();

  // Initialize FHEVM on mount
  useEffect(() => {
    const init = async () => {
      const status = getFhevmStatus();
      if (status.isReady) {
        setFhevmStatus("ready");
        return;
      }
      
      setFhevmStatus("initializing");
      try {
        await initFhevm();
        setFhevmStatus("ready");
      } catch (error: any) {
        setFhevmStatus("error");
        setFhevmError(error.message || "Failed to initialize FHEVM");
      }
    };
    
    init();
  }, [setFhevmStatus, setFhevmError]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      resetAll();
    }
  }, [isConnected, resetAll]);

  return (
    <main className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-16">
        {currentPage === "home" ? <HomePage /> : <VerifyPage />}
      </div>
    </main>
  );
}

