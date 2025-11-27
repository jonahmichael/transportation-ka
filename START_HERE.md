# 🚍 SURAKSHA CHAIN - Quick Start Guide

## ✅ System is Ready!

Your blockchain-based fleet management system is now running with **10 buses and over 130 transactions** of dummy data!

---

## 🌐 Access the System

### **1. Depot Manager Dashboard**
**URL:** http://localhost:3000/depot

**What you'll see:**
- 10 KSRTC buses with live metrics
- Total buses, active routes, workshop status
- Search and filter capabilities
- Click any bus to view its complete Digital Vehicle Passport

**Features:**
- View all bus details (registration, chassis, model)
- Complete maintenance history with spare parts
- Fuel consumption records
- Accident reports with blockchain verification

---

### **2. Workshop Mechanic App**
**URL:** http://localhost:3000/mechanic

**What you'll see:**
- Tablet-optimized interface for mechanics
- Interactive 10-task maintenance checklist
- QR code scanning simulation
- Real-time blockchain submission

**How to use:**
1. Login with any 4-digit employee ID (e.g., 1001, 2345)
2. Select a bus from the dropdown
3. Complete the maintenance checklist tasks
4. Submit directly to blockchain

---

### **3. Analytics & Audit Dashboard**
**URL:** http://localhost:3000/analytics

**What you'll see:**
- **Fleet Analytics:** Charts showing fuel efficiency, maintenance costs, fleet composition
- **Blockchain Ledger Explorer:** All 130+ transactions with search and filter
- **Incident Hotspots:** Analysis of accident locations
- **Real-time Stats:** Live KPIs from blockchain

**Features:**
- Interactive charts (powered by Recharts)
- Transaction search by type, bus, date
- Blockchain verification for every record
- Export-ready data views

---

## 📊 Dummy Data Summary

Your blockchain now contains:
- **10 Buses** (KA-01-F-1234 through KA-09-F-8901)
- **33 Maintenance Records** (various service types)
- **72 Fuel Records** (realistic consumption data)
- **6 Accident Records** (on 3 buses - 30% incident rate)
- **Total: 131 blockchain transactions**

---

## 🔧 Technical Setup

### Current Configuration:
- **Smart Contract:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Blockchain:** Hardhat in-memory network (resets on restart)
- **Frontend:** React + Vite running on port 3000
- **Web3:** Ethers.js v6 for blockchain interaction

### If You Need to Restart:

1. **Redeploy with data:**
   ```bash
   npm run start
   ```

2. **Start frontend (if stopped):**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🎯 What to Explore

### Try These Actions:

1. **Depot Manager:**
   - Click on "KA-01-F-1234" to see full passport
   - Check the Maintenance tab for service history
   - View Fuel tab for consumption patterns
   - See Accidents tab for incident reports

2. **Mechanic App:**
   - Login as employee 1234
   - Select "KA-03-F-3456"
   - Mark tasks complete one by one
   - Submit to blockchain

3. **Analytics:**
   - View the Fuel Efficiency chart
   - Check Maintenance Costs breakdown
   - Explore the Blockchain Ledger
   - Search for specific transactions

---

## 🔑 Key Features Demonstrated

✅ **Blockchain Integration:** Every action writes to immutable ledger  
✅ **NFT-based Vehicle Passports:** Each bus is an ERC-721 token  
✅ **Role-based Interfaces:** Three distinct user experiences  
✅ **Real-time Data:** Live blockchain queries  
✅ **Audit Trail:** Complete transaction history  
✅ **Search & Filter:** Find any record instantly  
✅ **Data Visualization:** Charts and analytics  
✅ **Mobile-optimized:** Mechanic app works on tablets  

---

## 📝 Notes

- **Data Persistence:** This is an in-memory blockchain. Data resets when you stop the process.
- **For Permanent Data:** Use `npm run node` in a separate terminal to run a persistent local blockchain.
- **MetaMask:** Not required for this demo (using Hardhat's built-in accounts).
- **Production:** For real deployment, you'd deploy to Mumbai testnet or Polygon mainnet.

---

## 🆘 Troubleshooting

**Frontend shows 0 buses?**
- Contract address might be wrong in `frontend/src/services/blockchain.js`
- Make sure it's: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

**Need to reset everything?**
1. Stop frontend (Ctrl+C)
2. Run `npm run start` to redeploy
3. Restart frontend with `cd frontend && npm run dev`

**Port already in use?**
- Change port in `frontend/vite.config.js`
- Or stop other processes using port 3000

---

## 🚀 Next Steps

- Explore all three interfaces
- Check the blockchain ledger for transaction details
- View maintenance patterns across the fleet
- Analyze fuel efficiency trends
- Test the mechanic checklist submission

---

**Enjoy exploring SURAKSHA CHAIN! 🎉**
