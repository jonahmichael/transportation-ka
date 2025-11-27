const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SURAKSHA CHAIN - KSRTC Fleet Management System...\n");

  // Get the contract factory
  const KSRTCFleet = await hre.ethers.getContractFactory("KSRTCFleet");
  
  // Deploy the contract
  console.log("📝 Deploying KSRTCFleet contract...");
  const ksrtcFleet = await KSRTCFleet.deploy();
  
  await ksrtcFleet.waitForDeployment();
  
  const contractAddress = await ksrtcFleet.getAddress();
  
  console.log("✅ KSRTCFleet deployed to:", contractAddress);
  console.log("📋 Contract Name:", await ksrtcFleet.name());
  console.log("🎫 Token Symbol:", await ksrtcFleet.symbol());
  console.log("\n🎉 Deployment complete!\n");
  
  return contractAddress;
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
