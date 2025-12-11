"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, usePublicClient, useSignTypedData } from "wagmi";
import { useAppStore } from "@/store/useAppStore";
import { encryptHealthData, userDecryptUint8 } from "@/lib/fhe";
import { ASCLEPIUS_ADDRESS, ASCLEPIUS_ABI, getTierFromPassCount } from "@/lib/contract";

const healthItems = [
  { key: "hivNegative", label: "HIV Status", question: "Is your HIV test negative?" },
  { key: "noCancer", label: "Cancer History", question: "Do you have no history of cancer?" },
  { key: "hepBNegative", label: "Hepatitis B", question: "Is your Hepatitis B test negative?" },
  { key: "noMentalIllness", label: "Mental Health", question: "No diagnosed mental illness history?" },
  { key: "noHeartDisease", label: "Heart Disease", question: "No history of heart disease?" },
] as const;

type HealthKey = typeof healthItems[number]["key"];

export default function HealthForm() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { healthData, setHealthData, setVerificationStep, setResultTier, setTxHash } = useAppStore();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const [isProcessing, setIsProcessing] = useState(false);

  const allAnswered = healthItems.every(item => healthData[item.key] !== null);

  const handleSelect = (key: HealthKey, value: boolean) => {
    setHealthData({ [key]: value });
  };

  const handleSubmit = async () => {
    if (!address || !allAnswered || !publicClient) return;

    setIsProcessing(true);

    try {
      setVerificationStep("encrypting");
      
      const encrypted = await encryptHealthData(
        ASCLEPIUS_ADDRESS,
        address,
        {
          hivNegative: healthData.hivNegative!,
          noCancer: healthData.noCancer!,
          hepBNegative: healthData.hepBNegative!,
          noMentalIllness: healthData.noMentalIllness!,
          noHeartDisease: healthData.noHeartDisease!,
        }
      );

      setVerificationStep("submitting");
      
      const hash = await writeContractAsync({
        address: ASCLEPIUS_ADDRESS,
        abi: ASCLEPIUS_ABI,
        functionName: "submitVerification",
        args: [
          encrypted.handles[0],
          encrypted.handles[1],
          encrypted.handles[2],
          encrypted.handles[3],
          encrypted.handles[4],
          encrypted.inputProof,
        ],
        gas: 5000000n,
      });

      setTxHash(hash);

      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: 1,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      setVerificationStep("decrypting");
      
      const result = await publicClient.readContract({
        address: ASCLEPIUS_ADDRESS,
        abi: ASCLEPIUS_ABI,
        functionName: "getVerificationHandle",
        args: [address],
      }) as [`0x${string}`, bigint];

      const [countHandle] = result;
      
      const passCount = await userDecryptUint8(
        countHandle,
        ASCLEPIUS_ADDRESS,
        address,
        signTypedDataAsync
      );

      const tier = getTierFromPassCount(passCount);
      setResultTier(tier);
      setVerificationStep("result");

    } catch (error: any) {
      setVerificationStep("input");
      alert(`Verification failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="space-y-4">
        {healthItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-warmGray-50 border border-warmGray-100"
          >
            <p className="text-warmGray-700 font-medium mb-3">{item.question}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleSelect(item.key, true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  healthData[item.key] === true
                    ? "bg-healing text-white shadow-md"
                    : "bg-white text-warmGray-600 border border-warmGray-200 hover:border-healing hover:text-healing"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleSelect(item.key, false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  healthData[item.key] === false
                    ? "bg-alert text-white shadow-md"
                    : "bg-white text-warmGray-600 border border-warmGray-200 hover:border-alert hover:text-alert"
                }`}
              >
                No
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleSubmit}
        disabled={!allAnswered || isProcessing}
        className="btn-primary w-full mt-6"
      >
        {isProcessing ? "Processing..." : "Submit Encrypted Verification"}
      </motion.button>

      {/* Privacy Notice */}
      <p className="text-center text-sm text-warmGray-400 mt-4">
        Your answers will be encrypted using FHE technology
      </p>
    </div>
  );
}
