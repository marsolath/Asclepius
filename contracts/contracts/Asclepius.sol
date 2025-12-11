// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, ebool, euint8, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Asclepius
 * @notice Privacy-preserving health verification for insurance underwriting
 * @dev Uses FHE to verify health conditions without revealing actual data
 * 
 * Verification Items (5 total):
 * 1. HIV Status (negative)
 * 2. Cancer History (none)
 * 3. Hepatitis B (negative)
 * 4. Mental Health History (none)
 * 5. Heart Disease History (none)
 * 
 * Result Tiers:
 * - STANDARD (3): All 5 conditions met
 * - SUBSTANDARD (2): 3-4 conditions met
 * - DECLINED (1): ≤2 conditions met
 */
contract Asclepius is ZamaEthereumConfig {
    
    // Verification record
    struct VerificationResult {
        euint8 encryptedPassCount;
        uint256 timestamp;
        bool exists;
    }
    
    // User verification results
    mapping(address => VerificationResult) private verificationResults;
    
    // Events
    event VerificationSubmitted(address indexed user, uint256 timestamp);
    
    /**
     * @notice Submit encrypted health data for verification
     */
    function submitVerification(
        externalEbool encHivNegative,
        externalEbool encNoCancer,
        externalEbool encHepBNegative,
        externalEbool encNoMentalIllness,
        externalEbool encNoHeartDisease,
        bytes calldata inputProof
    ) external {
        // Convert and count in a gas-efficient way
        euint8 count = FHE.asEuint8(0);
        
        // Add each condition (1 if true, 0 if false)
        ebool b1 = FHE.fromExternal(encHivNegative, inputProof);
        count = FHE.add(count, FHE.select(b1, FHE.asEuint8(1), FHE.asEuint8(0)));
        
        ebool b2 = FHE.fromExternal(encNoCancer, inputProof);
        count = FHE.add(count, FHE.select(b2, FHE.asEuint8(1), FHE.asEuint8(0)));
        
        ebool b3 = FHE.fromExternal(encHepBNegative, inputProof);
        count = FHE.add(count, FHE.select(b3, FHE.asEuint8(1), FHE.asEuint8(0)));
        
        ebool b4 = FHE.fromExternal(encNoMentalIllness, inputProof);
        count = FHE.add(count, FHE.select(b4, FHE.asEuint8(1), FHE.asEuint8(0)));
        
        ebool b5 = FHE.fromExternal(encNoHeartDisease, inputProof);
        count = FHE.add(count, FHE.select(b5, FHE.asEuint8(1), FHE.asEuint8(0)));
        
        // Allow contract and user to access
        FHE.allowThis(count);
        FHE.allow(count, msg.sender);
        
        // Store result
        verificationResults[msg.sender] = VerificationResult({
            encryptedPassCount: count,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit VerificationSubmitted(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Get encrypted pass count handle for user decryption
     */
    function getVerificationHandle(address user) external view returns (
        euint8 countHandle,
        uint256 timestamp
    ) {
        require(verificationResults[user].exists, "No verification found");
        VerificationResult storage result = verificationResults[user];
        return (result.encryptedPassCount, result.timestamp);
    }
    
    /**
     * @notice Check if user has verification result
     */
    function hasVerification(address user) external view returns (bool) {
        return verificationResults[user].exists;
    }
}
