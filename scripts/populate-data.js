const hre = require("hardhat");

/**
 * Script to populate the blockchain with dummy KSRTC fleet data
 * Creates multiple buses with realistic maintenance, fuel, and accident records
 */

// Dummy data sets
const BUSES = [
  { reg: "KA-01-F-1234", chassis: "MA3GJEB1S00123456", model: "Volvo B7R Multi-Axle", odometer: 50 },
  { reg: "KA-01-F-5678", chassis: "MA3GJEB1S00234567", model: "Tata Marcopolo", odometer: 75 },
  { reg: "KA-02-F-9012", chassis: "MA3GJEB1S00345678", model: "Ashok Leyland Viking", odometer: 100 },
  { reg: "KA-03-F-3456", chassis: "MA3GJEB1S00456789", model: "BYD K9 Electric", odometer: 25 },
  { reg: "KA-04-F-7890", chassis: "MA3GJEB1S00567890", model: "Volvo 9400 B8R", odometer: 150 },
  { reg: "KA-05-F-2345", chassis: "MA3GJEB1S00678901", model: "Tata Starbus Ultra", odometer: 80 },
  { reg: "KA-06-F-6789", chassis: "MA3GJEB1S00789012", model: "Ashok Leyland 2516", odometer: 120 },
  { reg: "KA-07-F-0123", chassis: "MA3GJEB1S00890123", model: "Volvo B11R", odometer: 60 },
  { reg: "KA-08-F-4567", chassis: "MA3GJEB1S00901234", model: "Mercedes-Benz OC500RF", odometer: 90 },
  { reg: "KA-09-F-8901", chassis: "MA3GJEB1S00012345", model: "Scania K400IB", odometer: 110 }
];

const WORKSHOPS = [
  "KSRTC-WS-BLR-CENTRAL",
  "KSRTC-WS-BLR-NORTH",
  "KSRTC-WS-BLR-SOUTH",
  "KSRTC-WS-MYS-01",
  "KSRTC-WS-HSR-01"
];

const DEPOTS = [
  "KSRTC-DEPOT-BLR-CENTRAL",
  "KSRTC-DEPOT-BLR-KEMPEGOWDA",
  "KSRTC-DEPOT-BLR-MAJESTIC",
  "KSRTC-DEPOT-MYS-MAIN",
  "KSRTC-DEPOT-HSR-01"
];

const MECHANICS = [
  "MECH-2024-1001",
  "MECH-2024-1002",
  "MECH-2024-1003",
  "MECH-2024-1004",
  "MECH-2024-1005"
];

const SUPERVISORS = [
  "SUPV-2024-2001",
  "SUPV-2024-2002",
  "SUPV-2024-2003"
];

const SERVICE_TYPES = [
  "10,000 km Service",
  "20,000 km Service",
  "40,000 km Service",
  "80,000 km Service",
  "Annual Inspection",
  "Pre-monsoon Check",
  "Emergency Repair"
];

const SPARE_PARTS = [
  ["SP-OIL-FILTER-001", "SP-ENGINE-OIL-5L"],
  ["SP-AIR-FILTER-002", "SP-CABIN-FILTER-003"],
  ["SP-BRAKE-PAD-004", "SP-BRAKE-FLUID-1L"],
  ["SP-BATTERY-12V-005"],
  ["SP-ALTERNATOR-006", "SP-BELT-KIT-007"],
  ["SP-SUSPENSION-BUSH-008", "SP-SHOCK-ABSORBER-009"],
  ["SP-HEADLIGHT-010", "SP-TAIL-LIGHT-011"],
  ["SP-WIPER-BLADE-012"],
  ["SP-COOLANT-5L-013", "SP-THERMOSTAT-014"],
  ["SP-TIRE-FRONT-015", "SP-TIRE-REAR-016"]
];

const ACCIDENT_LOCATIONS = [
  "Bangalore-Mysore Highway, KM 45",
  "Bangalore-Chennai Highway, KM 30",
  "Hosur Road Junction",
  "Tumkur Road, KM 20",
  "Electronic City Circle",
  "Bangalore-Mangalore Highway, KM 55",
  "Kanakapura Road, KM 15"
];

const ACCIDENT_DESCRIPTIONS = [
  "Minor collision with roadside barrier. No injuries. Front bumper damaged.",
  "Rear-end collision at traffic signal. Minor damage to rear panel.",
  "Side mirror damaged by passing vehicle. No other damage.",
  "Small scratch on left side door panel from narrow road passage.",
  "Windshield cracked by stone impact. Replaced immediately.",
  "Minor dent on front fender from parking incident.",
  "Tail light assembly broken. Replaced same day."
];

// Helper functions
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🚍 SURAKSHA CHAIN - Dummy Data Population Script");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Get signers
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Owner Address:", owner.address);
  console.log();

  // Deploy contract
  console.log("━━━ Deploying Smart Contract ━━━");
  const KSRTCFleet = await hre.ethers.getContractFactory("KSRTCFleet");
  const ksrtcFleet = await KSRTCFleet.deploy();
  await ksrtcFleet.waitForDeployment();
  const contractAddress = await ksrtcFleet.getAddress();
  
  console.log("✅ Contract deployed at:", contractAddress);
  console.log();

  // Create buses
  console.log("━━━ Creating Bus Fleet ━━━");
  const busTokenIds = [];
  
  for (let i = 0; i < BUSES.length; i++) {
    const bus = BUSES[i];
    console.log(`\n[${i + 1}/${BUSES.length}] Creating ${bus.reg}...`);
    
    // Mint bus
    const mintTx = await ksrtcFleet.mintBusPassport(
      owner.address,
      bus.reg,
      bus.chassis,
      bus.model
    );
    await mintTx.wait();
    
    const tokenId = await ksrtcFleet.getTokenIdByRegistration(bus.reg);
    busTokenIds.push(tokenId);
    console.log(`   ✅ Minted (Token ID: ${tokenId})`);
    
    // Commission bus
    const commissionTx = await ksrtcFleet.commissionBus(tokenId, bus.odometer);
    await commissionTx.wait();
    console.log(`   ✅ Commissioned (Initial Odometer: ${bus.odometer} km)`);
    
    await delay(100); // Small delay to avoid nonce issues
  }

  console.log(`\n✅ Created ${BUSES.length} buses`);
  console.log();

  // Add maintenance records
  console.log("━━━ Adding Maintenance Records ━━━");
  let totalMaintenance = 0;
  
  for (let i = 0; i < busTokenIds.length; i++) {
    const tokenId = busTokenIds[i];
    const bus = BUSES[i];
    const numRecords = randomInt(2, 5); // 2-5 maintenance records per bus
    
    console.log(`\n${bus.reg}: Adding ${numRecords} maintenance records...`);
    
    for (let j = 0; j < numRecords; j++) {
      const serviceType = SERVICE_TYPES[j % SERVICE_TYPES.length];
      const workshopId = randomElement(WORKSHOPS);
      const mechanicId = randomElement(MECHANICS);
      const supervisorId = randomElement(SUPERVISORS);
      const spareParts = randomElement(SPARE_PARTS);
      const odometerReading = bus.odometer + (j + 1) * 10000;
      
      const maintenanceTx = await ksrtcFleet.addMaintenanceRecord(
        tokenId,
        serviceType,
        workshopId,
        mechanicId,
        supervisorId,
        spareParts,
        odometerReading
      );
      await maintenanceTx.wait();
      
      console.log(`   ✅ ${serviceType} @ ${odometerReading} km`);
      totalMaintenance++;
      
      await delay(100);
    }
  }

  console.log(`\n✅ Added ${totalMaintenance} maintenance records`);
  console.log();

  // Add fuel records
  console.log("━━━ Adding Fuel Records ━━━");
  let totalFuel = 0;
  
  for (let i = 0; i < busTokenIds.length; i++) {
    const tokenId = busTokenIds[i];
    const bus = BUSES[i];
    const numRecords = randomInt(5, 10); // 5-10 fuel records per bus
    
    console.log(`\n${bus.reg}: Adding ${numRecords} fuel records...`);
    
    for (let j = 0; j < numRecords; j++) {
      const depotId = randomElement(DEPOTS);
      const litersDispensed = randomInt(10000, 15000); // 100-150 liters (stored as liters * 100)
      const odometerReading = bus.odometer + (j + 1) * 2000;
      
      const fuelTx = await ksrtcFleet.addFuelRecord(
        tokenId,
        depotId,
        litersDispensed,
        odometerReading
      );
      await fuelTx.wait();
      
      totalFuel++;
      
      await delay(50);
    }
    console.log(`   ✅ Added ${numRecords} fuel records`);
  }

  console.log(`\n✅ Added ${totalFuel} fuel records`);
  console.log();

  // Add accident records (only for some buses)
  console.log("━━━ Adding Accident Records ━━━");
  let totalAccidents = 0;
  
  // Add accidents to 30% of buses
  const busesWithAccidents = Math.floor(busTokenIds.length * 0.3);
  
  for (let i = 0; i < busesWithAccidents; i++) {
    const tokenId = busTokenIds[i];
    const bus = BUSES[i];
    const numAccidents = randomInt(1, 2); // 1-2 accidents per affected bus
    
    console.log(`\n${bus.reg}: Adding ${numAccidents} accident record(s)...`);
    
    for (let j = 0; j < numAccidents; j++) {
      const reportId = `ACC-2024-${1000 + totalAccidents}`;
      const location = randomElement(ACCIDENT_LOCATIONS);
      const description = randomElement(ACCIDENT_DESCRIPTIONS);
      const reportHash = hre.ethers.id(`IPFS_HASH_${reportId}_${Date.now()}`);
      
      const accidentTx = await ksrtcFleet.addAccidentRecord(
        tokenId,
        reportId,
        location,
        description,
        reportHash
      );
      await accidentTx.wait();
      
      console.log(`   ⚠️  ${reportId}: ${location}`);
      totalAccidents++;
      
      await delay(100);
    }
  }

  console.log(`\n✅ Added ${totalAccidents} accident records`);
  console.log();

  // Summary
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("📊 DATA POPULATION COMPLETE");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log();
  console.log("📈 Summary Statistics:");
  console.log(`   🚍 Buses Created:         ${BUSES.length}`);
  console.log(`   🔧 Maintenance Records:   ${totalMaintenance}`);
  console.log(`   ⛽ Fuel Records:          ${totalFuel}`);
  console.log(`   ⚠️  Accident Records:     ${totalAccidents}`);
  console.log(`   📝 Total Transactions:    ${BUSES.length * 2 + totalMaintenance + totalFuel + totalAccidents}`);
  console.log();
  console.log("🔗 Contract Address:");
  console.log(`   ${contractAddress}`);
  console.log();
  console.log("💡 Next Steps:");
  console.log("   1. Update frontend/src/services/blockchain.js with contract address:");
  console.log(`      const CONTRACT_ADDRESS = '${contractAddress}'`);
  console.log();
  console.log("   2. Start the frontend:");
  console.log("      cd frontend && npm run dev");
  console.log();
  console.log("   3. Access the interfaces:");
  console.log("      - Depot Manager: http://localhost:3000/depot");
  console.log("      - Mechanic App:  http://localhost:3000/mechanic");
  console.log("      - Analytics:     http://localhost:3000/analytics");
  console.log();
  console.log("✅ All dummy data has been written to the blockchain!");
  console.log("═══════════════════════════════════════════════════════════════\n");
}

// Execute
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ Error during data population:");
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
