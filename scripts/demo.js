const hre = require("hardhat");

/**
 * Utility function to format timestamp to readable date
 */
function formatDate(timestamp) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

/**
 * Utility function to format liters (stored as liters * 100)
 */
function formatLiters(litersDispensed) {
  return (Number(litersDispensed) / 100).toFixed(2);
}

/**
 * Main demonstration function - simulates complete bus lifecycle
 */
async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🚍 SURAKSHA CHAIN - Digital Vehicle Passport Demonstration");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Get signers
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Owner Address:", owner.address);
  console.log();

  // ==================== STEP 1: Deploy Contract ====================
  console.log("━━━ STEP 1: Deploying Smart Contract ━━━");
  const KSRTCFleet = await hre.ethers.getContractFactory("KSRTCFleet");
  const ksrtcFleet = await KSRTCFleet.deploy();
  await ksrtcFleet.waitForDeployment();
  const contractAddress = await ksrtcFleet.getAddress();
  
  console.log("✅ Contract deployed at:", contractAddress);
  console.log("📋 Token Name:", await ksrtcFleet.name());
  console.log("🎫 Token Symbol:", await ksrtcFleet.symbol());
  console.log();

  // ==================== STEP 2: Mint Bus Passport ====================
  console.log("━━━ STEP 2: Minting Digital Vehicle Passport (NFT) ━━━");
  const registrationNumber = "KA-01-F-1234";
  const chassisNumber = "MA3GJEB1S00123456";
  const model = "Volvo B7R Multi-Axle";
  
  console.log("🏭 Creating bus passport for:");
  console.log("   Registration:", registrationNumber);
  console.log("   Chassis:", chassisNumber);
  console.log("   Model:", model);
  
  const mintTx = await ksrtcFleet.mintBusPassport(
    owner.address,
    registrationNumber,
    chassisNumber,
    model
  );
  await mintTx.wait();
  
  // Get the token ID
  const tokenId = await ksrtcFleet.getTokenIdByRegistration(registrationNumber);
  console.log("✅ Bus passport minted! Token ID:", tokenId.toString());
  console.log("🎫 NFT Owner:", await ksrtcFleet.ownerOf(tokenId));
  console.log();

  // ==================== STEP 3: Commission Bus ====================
  console.log("━━━ STEP 3: Commissioning Bus (Birth Certificate) ━━━");
  const initialOdometer = 50; // 50 km after initial test drive
  
  console.log("📍 Initial Odometer Reading:", initialOdometer, "km");
  
  const commissionTx = await ksrtcFleet.commissionBus(tokenId, initialOdometer);
  await commissionTx.wait();
  
  console.log("✅ Bus commissioned successfully!");
  console.log("📅 Commissioning completed");
  console.log();

  // ==================== STEP 4: Log Maintenance Event ====================
  console.log("━━━ STEP 4: Recording Maintenance Event ━━━");
  const serviceType = "10,000 km Service";
  const workshopId = "KSRTC-WS-BLR-01";
  const mechanicId = "MECH-2024-5678";
  const supervisorId = "SUPV-2024-1234";
  const sparePartsUsed = ["SP-OIL-FILTER-001", "SP-AIR-FILTER-002", "SP-ENGINE-OIL-5L"];
  const maintenanceOdometer = 10050;
  
  console.log("🔧 Service Type:", serviceType);
  console.log("🏢 Workshop ID:", workshopId);
  console.log("👨‍🔧 Mechanic ID:", mechanicId);
  console.log("👨‍💼 Supervisor ID:", supervisorId);
  console.log("🔩 Spare Parts Used:", sparePartsUsed.length, "items");
  console.log("   -", sparePartsUsed.join("\n   - "));
  console.log("📊 Odometer Reading:", maintenanceOdometer, "km");
  
  const maintenanceTx = await ksrtcFleet.addMaintenanceRecord(
    tokenId,
    serviceType,
    workshopId,
    mechanicId,
    supervisorId,
    sparePartsUsed,
    maintenanceOdometer
  );
  await maintenanceTx.wait();
  
  console.log("✅ Maintenance record added to blockchain!");
  console.log();

  // ==================== STEP 5: Log Fuel Event ====================
  console.log("━━━ STEP 5: Recording Fuel Consumption Event ━━━");
  const depotId = "KSRTC-DEPOT-BLR-CENTRAL";
  const litersDispensed = 12550; // 125.50 liters (stored as liters * 100)
  const fuelOdometer = 10250;
  
  console.log("⛽ Depot ID:", depotId);
  console.log("📊 Fuel Dispensed:", formatLiters(litersDispensed), "liters");
  console.log("📊 Odometer Reading:", fuelOdometer, "km");
  
  const fuelTx = await ksrtcFleet.addFuelRecord(
    tokenId,
    depotId,
    litersDispensed,
    fuelOdometer
  );
  await fuelTx.wait();
  
  console.log("✅ Fuel record added to blockchain!");
  console.log();

  // ==================== STEP 6: Log Accident ====================
  console.log("━━━ STEP 6: Recording Accident Event ━━━");
  const reportId = "ACC-2024-11-001";
  const location = "Bangalore-Mysore Highway, KM 45";
  const description = "Minor collision with roadside barrier. No injuries. Front bumper damaged.";
  // In real scenario, this would be the hash of a document stored on IPFS
  const reportHash = hre.ethers.id("IPFS_HASH_QmXyZ123...AccidentReport_Photos_Documents");
  
  console.log("⚠️  Accident Report ID:", reportId);
  console.log("📍 Location:", location);
  console.log("📝 Description:", description);
  console.log("🔐 Report Hash (IPFS):", reportHash.substring(0, 20) + "...");
  
  const accidentTx = await ksrtcFleet.addAccidentRecord(
    tokenId,
    reportId,
    location,
    description,
    reportHash
  );
  await accidentTx.wait();
  
  console.log("✅ Accident record added to blockchain!");
  console.log();

  // ==================== STEP 7: Retrieve Complete Bus Details ====================
  console.log("━━━ STEP 7: Retrieving Complete Digital Passport ━━━");
  console.log("📖 Fetching immutable records from blockchain...\n");
  
  const busDetails = await ksrtcFleet.getBusDetails(tokenId);
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("📋 DIGITAL VEHICLE PASSPORT - COMPLETE HISTORY");
  console.log("═══════════════════════════════════════════════════════════════\n");
  
  // Basic Information
  console.log("🚌 VEHICLE INFORMATION:");
  console.log("   Token ID:", tokenId.toString());
  console.log("   Registration Number:", busDetails.registrationNumber);
  console.log("   Chassis Number:", busDetails.chassisNumber);
  console.log("   Model:", busDetails.model);
  console.log("   Commissioned:", busDetails.isCommissioned ? "Yes ✅" : "No ❌");
  if (busDetails.isCommissioned) {
    console.log("   Commissioning Date:", formatDate(busDetails.commissioningDate));
    console.log("   Initial Odometer:", busDetails.initialOdometer.toString(), "km");
  }
  console.log();

  // Maintenance History
  console.log("🔧 MAINTENANCE HISTORY:");
  console.log("   Total Records:", busDetails.maintenanceHistory.length);
  if (busDetails.maintenanceHistory.length > 0) {
    busDetails.maintenanceHistory.forEach((record, index) => {
      console.log(`\n   ┌─ Record ${index + 1} ─────────────────────────────────────`);
      console.log("   │ Date:", formatDate(record.timestamp));
      console.log("   │ Service Type:", record.serviceType);
      console.log("   │ Workshop:", record.workshopId);
      console.log("   │ Mechanic:", record.mechanicId);
      console.log("   │ Supervisor:", record.supervisorId);
      console.log("   │ Odometer:", record.odometerReading.toString(), "km");
      console.log("   │ Spare Parts Used:", record.sparePartsUsed.length, "items");
      record.sparePartsUsed.forEach(part => {
        console.log("   │   -", part);
      });
      console.log("   └──────────────────────────────────────────────────");
    });
  }
  console.log();

  // Accident History
  console.log("⚠️  ACCIDENT HISTORY:");
  console.log("   Total Records:", busDetails.accidentHistory.length);
  if (busDetails.accidentHistory.length > 0) {
    busDetails.accidentHistory.forEach((record, index) => {
      console.log(`\n   ┌─ Record ${index + 1} ─────────────────────────────────────`);
      console.log("   │ Date:", formatDate(record.timestamp));
      console.log("   │ Report ID:", record.reportId);
      console.log("   │ Location:", record.location);
      console.log("   │ Description:", record.description);
      console.log("   │ Report Hash:", record.reportHash.substring(0, 30) + "...");
      console.log("   └──────────────────────────────────────────────────");
    });
  }
  console.log();

  // Fuel History
  console.log("⛽ FUEL CONSUMPTION HISTORY:");
  console.log("   Total Records:", busDetails.fuelHistory.length);
  if (busDetails.fuelHistory.length > 0) {
    busDetails.fuelHistory.forEach((record, index) => {
      console.log(`\n   ┌─ Record ${index + 1} ─────────────────────────────────────`);
      console.log("   │ Date:", formatDate(record.timestamp));
      console.log("   │ Depot:", record.depotId);
      console.log("   │ Fuel Dispensed:", formatLiters(record.litersDispensed), "liters");
      console.log("   │ Odometer:", record.odometerReading.toString(), "km");
      console.log("   └──────────────────────────────────────────────────");
    });
  }
  console.log();

  // Summary Statistics
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("📊 SUMMARY STATISTICS:");
  console.log("   Total Maintenance Events:", busDetails.maintenanceHistory.length);
  console.log("   Total Accident Events:", busDetails.accidentHistory.length);
  console.log("   Total Fuel Events:", busDetails.fuelHistory.length);
  console.log("   Total Buses in System:", (await ksrtcFleet.getTotalBuses()).toString());
  console.log("═══════════════════════════════════════════════════════════════\n");

  console.log("✅ DEMONSTRATION COMPLETE!");
  console.log("🔗 All data is permanently stored on the blockchain");
  console.log("🔒 Records are immutable and tamper-proof");
  console.log("🎉 SURAKSHA CHAIN is operational!\n");
}

// Execute demonstration
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ Error during demonstration:");
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
