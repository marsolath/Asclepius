import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

// Read from secret file
const fs = require("fs");
const secretPath = "../secret";
let PRIVATE_KEY = "";
let SEPOLIA_RPC = "";
let ETHERSCAN_API_KEY = "";

if (fs.existsSync(secretPath)) {
  const secretContent = fs.readFileSync(secretPath, "utf8");
  const privateKeyMatch = secretContent.match(/PRIVATE_KEY[：:]\s*([a-fA-F0-9]{64})/);
  const rpcMatch = secretContent.match(/SEPOLIA_RPC[：:]\s*(https:\/\/[^\s]+)/);
  const etherscanMatch = secretContent.match(/ETHERSCAN_API_KEY[：:]\s*([^\s]+)/);
  
  if (privateKeyMatch) PRIVATE_KEY = privateKeyMatch[1];
  if (rpcMatch) SEPOLIA_RPC = rpcMatch[1];
  if (etherscanMatch) ETHERSCAN_API_KEY = etherscanMatch[1];
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC || "https://eth-sepolia.g.alchemy.com/v2/demo",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
