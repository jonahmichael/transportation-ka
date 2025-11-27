/**
 * Combined script to deploy contract and populate data
 * This runs on the hardhat network and then starts a persistent node
 */

const hre = require("hardhat");

// Same data from populate-data.js
const BUSES = [
  { registration: 'KA-01-F-1234', chassis: 'CH1234567890', model: 'Tata Starbus', depot: 'Shantinagar', initialOdometer: 50 },
  { registration: 'KA-01-F-5678', chassis: 'CH2345678901', model: 'Ashok Leyland Viking', depot: 'Banashankari', initialOdometer: 75 },
  { registration: 'KA-02-F-9012', chassis: 'CH3456789012', model: 'BYD K9 Electric', depot: 'Kengeri', initialOdometer: 100 },
  { registration: 'KA-03-F-3456', chassis: 'CH4567890123', model: 'Tata Starbus', depot: 'Jayanagar', initialOdometer: 25 },
  { registration: 'KA-04-F-7890', chassis: 'CH5678901234', model: 'Ashok Leyland Viking', depot: 'Yeshwanthpur', initialOdometer: 150 },
  { registration: 'KA-05-F-2345', chassis: 'CH6789012345', model: 'Volvo 8400', depot: 'Shantinagar', initialOdometer: 80 },
  { registration: 'KA-06-F-6789', chassis: 'CH7890123456', model: 'BYD K9 Electric', depot: 'Banashankari', initialOdometer: 120 },
  { registration: 'KA-07-F-0123', chassis: 'CH8901234567', model: 'Tata Starbus', depot: 'Kengeri', initialOdometer: 60 },
  { registration: 'KA-08-F-4567', chassis: 'CH9012345678', model: 'Ashok Leyland Viking', depot: 'Jayanagar', initialOdometer: 90 },
  { registration: 'KA-09-F-8901', chassis: 'CH0123456789', model: 'Volvo 8400', depot: 'Yeshwanthpur', initialOdometer: 110 }
];

const WORKSHOPS = [
  'Central Workshop - Rajajinagar',
  'Yeshwanthpur Workshop',
  'Shantinagar Workshop',
  'Banashankari Workshop',
  'Kengeri Workshop'
];

const DEPOTS = ['Shantinagar', 'Banashankari', 'Kengeri', 'Jayanagar', 'Yeshwanthpur'];
const MECHANICS = ['Ramesh Kumar', 'Suresh Patel', 'Mahesh Reddy', 'Ganesh Rao', 'Dinesh Singh'];
const SUPERVISORS = ['Supervisor A. Kumar', 'Supervisor B. Sharma', 'Supervisor C. Iyer'];

const SERVICE_TYPES = [
  '10,000 km Service',
  '20,000 km Service',
  '40,000 km Service',
  '80,000 km Service',
  'Annual Inspection',
  'PMI Service'
];

const SPARE_PARTS = [
  ['Engine Oil', 'Oil Filter', 'Air Filter'],
  ['Brake Pads', 'Brake Fluid', 'Brake Shoes'],
  ['Transmission Oil', 'Coolant'],
  ['Battery', 'Alternator Belt'],
  ['Wiper Blades', 'Light Bulbs'],
  ['Suspension Bushings', 'Shock Absorbers']
];

const ACCIDENT_LOCATIONS = [
  'Hosur Road Junction',
  'Electronic City Circle',
  'Tumkur Road, KM 20',
  'Mysore Road Highway',
  'Bellary Road Toll Plaza'
];

const ACCIDENT_DESCRIPTIONS = [
  'Minor collision with auto-rickshaw while changing lanes',
  'Rear-end collision at traffic signal',
  'Side-swipe accident with two-wheeler',
  'Hit parked vehicle while reversing at depot',
  'Collision with stray cattle on highway'
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚍 SURAKSHA CHAIN - Quick Start with Data');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [owner] = await hre.ethers.getSigners();
  console.log(`👤 Owner Address: ${owner.address}\n`);

  // Deploy contract
  console.log('━━━ Deploying Smart Contract ━━━');
  const KSRTCFleet = await hre.ethers.getContractFactory("KSRTCFleet");
  const contract = await KSRTCFleet.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}\n`);

  // Create buses
  console.log('━━━ Creating Bus Fleet ━━━\n');
  for (let i = 0; i < BUSES.length; i++) {
    const bus = BUSES[i];
    console.log(`[${i + 1}/${BUSES.length}] Creating ${bus.registration}...`);
    
    // Mint
    const mintTx = await contract.mintBusPassport(
      owner.address,
      bus.registration,
      bus.chassis,
      bus.model
    );
    await mintTx.wait();
    const tokenId = i + 1;
    console.log(`   ✅ Minted (Token ID: ${tokenId})`);
    
    // Commission
    const commissionTx = await contract.commissionBus(tokenId, bus.initialOdometer);
    await commissionTx.wait();
    console.log(`   ✅ Commissioned (Initial Odometer: ${bus.initialOdometer} km)\n`);
  }

  console.log(`✅ Created ${BUSES.length} buses\n`);

  // Add maintenance records
  console.log('━━━ Adding Maintenance Records ━━━\n');
  let totalMaintenance = 0;
  
  for (let tokenId = 1; tokenId <= BUSES.length; tokenId++) {
    const bus = BUSES[tokenId - 1];
    const numRecords = random(2, 5);
    console.log(`${bus.registration}: Adding ${numRecords} maintenance records...`);
    
    for (let i = 0; i < numRecords; i++) {
      const serviceType = SERVICE_TYPES[Math.min(i, SERVICE_TYPES.length - 1)];
      const odometer = bus.initialOdometer + (i + 1) * 10000;
      const spareParts = randomChoice(SPARE_PARTS);
      
      const tx = await contract.addMaintenanceRecord(
        tokenId,
        serviceType,
        randomChoice(WORKSHOPS),
        randomChoice(MECHANICS),
        randomChoice(SUPERVISORS),
        spareParts,
        odometer
      );
      await tx.wait();
      console.log(`   ✅ ${serviceType} @ ${odometer} km`);
      totalMaintenance++;
    }
    console.log('');
  }

  console.log(`✅ Added ${totalMaintenance} maintenance records\n`);

  // Add fuel records
  console.log('━━━ Adding Fuel Records ━━━\n');
  let totalFuel = 0;
  
  for (let tokenId = 1; tokenId <= BUSES.length; tokenId++) {
    const bus = BUSES[tokenId - 1];
    const numRecords = random(5, 10);
    console.log(`${bus.registration}: Adding ${numRecords} fuel records...`);
    
    for (let i = 0; i < numRecords; i++) {
      const tx = await contract.addFuelRecord(
        tokenId,
        bus.depot,
        random(40, 80),
        bus.initialOdometer + random(100, 5000)
      );
      await tx.wait();
      totalFuel++;
    }
    console.log(`   ✅ Added ${numRecords} fuel records\n`);
  }

  console.log(`✅ Added ${totalFuel} fuel records\n`);

  // Add accident records (30% of buses)
  console.log('━━━ Adding Accident Records ━━━\n');
  let totalAccidents = 0;
  const busesWithAccidents = Math.floor(BUSES.length * 0.3);
  
  for (let i = 0; i < busesWithAccidents; i++) {
    const tokenId = i + 1;
    const bus = BUSES[tokenId - 1];
    const numAccidents = random(1, 2);
    console.log(`${bus.registration}: Adding ${numAccidents} accident record(s)...`);
    
    for (let j = 0; j < numAccidents; j++) {
      const accidentId = `ACC-2024-${1000 + totalAccidents}`;
      const location = randomChoice(ACCIDENT_LOCATIONS);
      const description = randomChoice(ACCIDENT_DESCRIPTIONS);
      const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(accidentId + location));
      
      const tx = await contract.addAccidentRecord(
        tokenId,
        accidentId,
        location,
        description,
        reportHash
      );
      await tx.wait();
      console.log(`   ⚠️  ${accidentId}: ${location}`);
      totalAccidents++;
    }
    console.log('');
  }

  console.log(`✅ Added ${totalAccidents} accident records\n`);

  // Summary
  const totalTransactions = BUSES.length * 2 + totalMaintenance + totalFuel + totalAccidents;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 DEPLOYMENT COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📈 Summary Statistics:');
  console.log(`   🚍 Buses Created:         ${BUSES.length}`);
  console.log(`   🔧 Maintenance Records:   ${totalMaintenance}`);
  console.log(`   ⛽ Fuel Records:          ${totalFuel}`);
  console.log(`   ⚠️  Accident Records:     ${totalAccidents}`);
  console.log(`   📝 Total Transactions:    ${totalTransactions}\n`);
  console.log('🔗 Contract Address:');
  console.log(`   ${contractAddress}\n`);
  console.log('💡 Next Steps:');
  console.log('   1. Update frontend/src/services/blockchain.js with contract address');
  console.log(`      const CONTRACT_ADDRESS = '${contractAddress}'\n`);
  console.log('   2. Start the frontend:');
  console.log('      cd frontend && npm run dev\n');
  console.log('   3. Access the interfaces:');
  console.log('      - Depot Manager: http://localhost:5173/depot');
  console.log('      - Mechanic App:  http://localhost:5173/mechanic');
  console.log('      - Analytics:     http://localhost:5173/analytics\n');
  console.log('✅ Blockchain is ready with dummy data!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error during deployment:');
    console.error(error);
    process.exit(1);
  });
