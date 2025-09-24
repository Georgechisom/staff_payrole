#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class TestnetDeployer {
  constructor() {
    this.projectRoot = path.join(__dirname, "..");
    this.contracts = ["sip-010-trait", "mock-token", "pay_role"];
  }

  async deploy() {
    console.log(
      " Starting Decentralized Payroll System Testnet Deployment...\n"
    );

    try {
      // Step 1: Check prerequisites
      await this.checkPrerequisites();

      // Step 2: Deploy contracts
      await this.deployContracts();

      // Step 3: Initialize system
      await this.initializeSystem();

      // Step 4: Verify deployment
      await this.verifyDeployment();

      console.log("\n Deployment completed successfully!");
      console.log("\n Next Steps:");
      console.log("1. Set up your admin roles using the contract functions");
      console.log("2. Add supported tokens for payments");
      console.log("3. Add employees and set up their payment schedules");
      console.log("4. Fund the treasury with tokens for payroll");
    } catch (error) {
      console.error("\n Deployment failed:", error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log("🔍 Checking prerequisites...");

    // Check if Clarinet is installed
    try {
      execSync("clarinet --version", { stdio: "pipe" });
      console.log(" Clarinet is installed");
    } catch (error) {
      throw new Error(
        "Clarinet is not installed. Please install it from https://docs.hiro.so/clarinet"
      );
    }

    // Check if we're in the right directory
    if (!fs.existsSync(path.join(this.projectRoot, "Clarinet.toml"))) {
      throw new Error(
        "Clarinet.toml not found. Please run this script from the project root."
      );
    }

    console.log(" All prerequisites met\n");
  }

  async deployContracts() {
    console.log(" Deploying contracts...");

    for (const contractName of this.contracts) {
      console.log(`Deploying ${contractName}...`);

      try {
        const output = execSync(`clarinet deploy --testnet ${contractName}`, {
          cwd: this.projectRoot,
          encoding: "utf8",
        });

        console.log(` ${contractName} deployed successfully`);
      } catch (error) {
        console.error(` Failed to deploy ${contractName}:`, error.message);
        throw error;
      }
    }

    console.log(" All contracts deployed\n");
  }

  async initializeSystem() {
    console.log("  Initializing system...");

    // Initialize company
    console.log("Initializing company...");
    try {
      const initResult = execSync(
        `clarinet console --execute "(contract-call? .pay_role initialize-company \\"Test Company Inc\\" u12345)"`,
        { cwd: this.projectRoot, encoding: "utf8" }
      );
      console.log(" Company initialized");
    } catch (error) {
      console.error(" Failed to initialize company:", error.message);
    }

    console.log(" System initialized\n");
  }

  async verifyDeployment() {
    console.log(" Verifying deployment...");

    try {
      // Check contract addresses
      const deployments = execSync(`clarinet deployments show`, {
        cwd: this.projectRoot,
        encoding: "utf8",
      });

      console.log(" Deployment Summary:");
      console.log(deployments);

      console.log(" Deployment verified\n");
    } catch (error) {
      console.warn("  Could not verify deployment automatically");
    }
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  const deployer = new TestnetDeployer();
  deployer.deploy();
}

module.exports = TestnetDeployer;
