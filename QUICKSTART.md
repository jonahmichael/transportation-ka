# 🚀 QUICK START - SURAKSHA CHAIN

## Get Running in 5 Minutes

### 1️⃣ Install (2 minutes)

```bash
# Install blockchain
npm install

# Install frontend
cd frontend
npm install
cd ..
```

### 2️⃣ Compile (30 seconds)

```bash
npm run compile
```

### 3️⃣ Run (Open 3 Terminals)

**Terminal 1 - Blockchain**:
```bash
npm run node
```

**Terminal 2 - Deploy**:
```bash
npm run deploy
# Copy the contract address!
```

Update address in `frontend/src/services/blockchain.js`:
```javascript
const CONTRACT_ADDRESS = '0xYourAddressFromAbove'
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev
```

### 4️⃣ Use the System

Open browser to `http://localhost:3000`

Try these URLs:
- **Depot Manager**: `http://localhost:3000/depot`
- **Mechanic App**: `http://localhost:3000/mechanic`
- **Analytics**: `http://localhost:3000/analytics`

---

## 🎯 What Each Interface Does

### Depot Manager (`/depot`)
For fleet supervisors to:
- View all buses
- Check maintenance history
- Verify blockchain records

**Try**: Click on a bus → View its complete passport

---

### Mechanic App (`/mechanic`)
For workshop staff to:
- Login with employee ID
- Complete maintenance checklists
- Submit work to blockchain

**Try**: Login with `1234` → Scan Bus → Complete tasks

---

### Analytics Portal (`/analytics`)
For executives to:
- View fleet metrics
- Analyze trends
- Audit blockchain records

**Try**: View charts → Click "Blockchain Ledger"

---

## 🔥 Just Want to See the Demo?

Skip the frontend, run:

```bash
npm run demo
```

This shows the complete bus lifecycle on blockchain!

---

## 📁 Key Files

- `contracts/KSRTCFleet.sol` - Smart contract
- `frontend/src/pages/DepotManager/Dashboard.jsx` - Manager UI
- `frontend/src/pages/Mechanic/MechanicApp.jsx` - Mechanic UI
- `frontend/src/pages/Analytics/Dashboard.jsx` - Analytics UI
- `frontend/src/services/blockchain.js` - Web3 connection

---

## 🐛 Problems?

**Blockchain not connecting?**
→ Make sure `npm run node` is running in Terminal 1

**Frontend blank?**
→ Check contract address in `blockchain.js`

**Need more help?**
→ See `COMPLETE_GUIDE.md`

---

**That's it! You're ready to go! 🚍🔗**
