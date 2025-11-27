# 🚀 Quick Setup - SURAKSHA CHAIN

## Run in 2 Terminals

### Terminal 1: Deploy & Populate Blockchain (One-time)
```bash
npm run start
```

This will:
- Deploy the smart contract
- Create 10 buses with full records
- Show you the contract address

**Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

---

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000/**

---

## Access the System

1. **Depot Manager Dashboard**: http://localhost:3000/depot
   - View all 10 buses
   - Click "Commission New Bus" to add more buses
   - Click any bus to see full passport

2. **Mechanic App**: http://localhost:3000/mechanic
   - Login with employee ID (e.g., 1234)
   - Complete maintenance checklists

3. **Analytics**: http://localhost:3000/analytics
   - View fleet charts and stats
   - Explore blockchain ledger

---

## Add New Buses

1. Go to Depot Manager Dashboard
2. Click **"Commission New Bus"** button
3. Fill in:
   - Registration Number (e.g., KA-10-F-1111)
   - Chassis Number (e.g., CH2222333344)
   - Select Bus Model
   - Initial Odometer Reading
4. Click **"Commission Bus"**
5. Bus will be added to blockchain and appear in fleet list

---

##  Features Working

✅ 10 Pre-loaded buses with data  
✅ Commission new buses via UI  
✅ View complete bus passports  
✅ Maintenance/fuel/accident records  
✅ Search and filter fleet  
✅ Real-time blockchain integration  
✅ Mechanic checklist app  
✅ Analytics dashboard with charts  
✅ Blockchain ledger explorer  

---

## Note

The blockchain data persists while the `npm run start` terminal is open. If you restart that terminal, you'll need to redeploy (data will reset).

For persistent data across restarts, you would need to deploy to a testnet like Mumbai.
