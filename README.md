# Asclepius

> Prove your health. Reveal nothing.

Health verification for insurance — without the insurer ever seeing your health data. FHE lets you prove eligibility while keeping every answer encrypted, even during computation.

## The Problem

Insurance companies need health information. Users don't want to share it. Traditional solutions force a choice: privacy or coverage.

**Asclepius eliminates that tradeoff.**

With FHE, health answers are encrypted in your browser, computed on-chain while still encrypted, and only a pass/fail tier is revealed. The insurer never sees your actual answers. You never compromise your privacy.

## How It Works

```
User answers 5 health questions
         ↓
    Encrypted locally (FHE)
         ↓
    Sent to smart contract
         ↓
    Computed on encrypted data
         ↓
    Result: Standard | Substandard | Declined
```

The contract counts how many criteria you meet — all in ciphertext. Only you can decrypt the final count.

## Features

- **Zero-knowledge health proof** — Insurers see tier, not data
- **Client-side encryption** — Data encrypted before leaving browser  
- **On-chain FHE computation** — No trusted third party
- **User-controlled decryption** — Only you unlock your result

## Verified Criteria

| # | Condition | Passing |
|---|-----------|---------|
| 1 | HIV Status | Negative |
| 2 | Cancer History | None |
| 3 | Hepatitis B | Negative |
| 4 | Mental Health History | None |
| 5 | Heart Disease History | None |

## Result Tiers

| Tier | Criteria Met | Outcome |
|------|-------------|---------|
| **Standard** | 5/5 | Full coverage, standard rates |
| **Substandard** | 3-4/5 | Coverage with adjusted premium |
| **Declined** | ≤2/5 | No coverage |

## Contract

| Network | Address | Status |
|---------|---------|--------|
| Sepolia | [`0x843C78b3341805cf1A8A24979a99074478F086D8`](https://sepolia.etherscan.io/address/0x843C78b3341805cf1A8A24979a99074478F086D8#code) | ✅ Verified |

## Tech Stack

| Layer | Stack |
|-------|-------|
| Contract | Solidity 0.8.24 + FHEVM v0.9 |
| Frontend | Next.js 14 + TypeScript + Tailwind |
| Wallet | RainbowKit + wagmi v2 |
| FHE | @zama-fhe/relayer-sdk |

## Quick Start

```bash
# Contracts
cd contracts && npm install && npm run compile

# Frontend
cd frontend && npm install && npm run dev
```

Open http://localhost:3000

## Tests

```bash
cd contracts && npm test
```

```
  Asclepius
    Deployment
      ✔ Should deploy successfully
    hasVerification
      ✔ Should return false for user without verification
      ✔ Should return false for zero address
    getVerificationHandle
      ✔ Should revert for user without verification
    Contract Structure
      ✔ Should have submitVerification function
      ✔ Should have getVerificationHandle function
      ✔ Should have hasVerification function
    Access Control
      ✔ Should allow any address to check verification status

  8 passing (1s)
```

## Privacy Guarantees

1. Health answers never leave browser unencrypted
2. Contract only operates on ciphertexts
3. Only user can decrypt their own result
4. Insurers see tier only — not which criteria failed

## License

MIT
