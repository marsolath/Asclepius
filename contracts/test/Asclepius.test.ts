import { expect } from "chai";
import { ethers } from "hardhat";
import { Asclepius } from "../typechain-types";

describe("Asclepius", function () {
  let asclepius: Asclepius;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const AsclepiusFactory = await ethers.getContractFactory("Asclepius");
    asclepius = await AsclepiusFactory.deploy();
    await asclepius.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await asclepius.getAddress();
      expect(address).to.be.properAddress;
    });
  });

  describe("hasVerification", function () {
    it("Should return false for user without verification", async function () {
      const hasResult = await asclepius.hasVerification(user1.address);
      expect(hasResult).to.equal(false);
    });

    it("Should return false for zero address", async function () {
      const hasResult = await asclepius.hasVerification(ethers.ZeroAddress);
      expect(hasResult).to.equal(false);
    });
  });

  describe("getVerificationHandle", function () {
    it("Should revert for user without verification", async function () {
      await expect(
        asclepius.getVerificationHandle(user1.address)
      ).to.be.revertedWith("No verification found");
    });
  });

  describe("Contract Structure", function () {
    it("Should have submitVerification function", async function () {
      expect(asclepius.submitVerification).to.be.a("function");
    });

    it("Should have getVerificationHandle function", async function () {
      expect(asclepius.getVerificationHandle).to.be.a("function");
    });

    it("Should have hasVerification function", async function () {
      expect(asclepius.hasVerification).to.be.a("function");
    });
  });

  describe("Access Control", function () {
    it("Should allow any address to check verification status", async function () {
      // user1 checks user2's status - should not revert
      const hasResult = await asclepius.connect(user1).hasVerification(user2.address);
      expect(hasResult).to.equal(false);
    });
  });
});
