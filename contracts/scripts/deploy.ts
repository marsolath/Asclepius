import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Asclepius contract...");

  const Asclepius = await ethers.getContractFactory("Asclepius");
  const asclepius = await Asclepius.deploy();

  await asclepius.waitForDeployment();

  const address = await asclepius.getAddress();
  console.log(`Asclepius deployed to: ${address}`);
  console.log(`\nVerify with:`);
  console.log(`npx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

