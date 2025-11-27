# SURAKSHA CHAIN - Complete Project Guide
## KSRTC Fleet Management System

A full-stack blockchain solution with smart contracts and three role-based user interfaces.

---

## 🎯 Complete System Overview

### Backend (Blockchain)
- **Smart Contract**: `KSRTCFleet.sol` (ERC-721 NFT)
- **Network**: Ethereum (Hardhat local node)
- **Features**: Immutable bus lifecycle records

### Frontend (React + Vite)
1. **Depot Manager Dashboard** - Fleet management & bus passports
2. **Workshop Mechanic App** - Tablet-optimized maintenance workflow  
3. **Analytics Portal** - Executive insights & blockchain explorer

---

## 🚀 Complete Installation & Setup

### Step 1: Install All Dependencies

```bash
# Install blockchain dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Compile Smart Contracts

```bash
npm run compile
```

### Step 3: Run the Complete System

You need **3 terminals**:

#### Terminal 1: Blockchain Node
```bash
npm run node
```
Leave this running. Provides blockchain at `http://localhost:8545`

#### Terminal 2: Deploy Contract
```bash
npm run deploy
```
Copy the contract address from output.

Update contract address in `frontend/src/services/blockchain.js`:
```javascript
const CONTRACT_ADDRESS = '0xYourAddressHere'
```

#### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will be at: `http://localhost:3000`

---

## 🎮 Using the Three Interfaces

### 1. Depot Manager Dashboard
**URL**: `http://localhost:3000/depot`

**What you'll see**:
- Fleet overview with 4 key metrics
- List of all buses with status
- Critical alerts section
- Search functionality

**Try this**:
1. Click on any bus (e.g., "KA-01-F-1234")
2. View its complete Digital Passport
3. Click tabs: Maintenance → Fuel → Accidents
4. Click blockchain proof icons

### 2. Workshop Mechanic App
**URL**: `http://localhost:3000/mechanic`

**What you'll see**:
- Login screen (enter any 4-digit ID like "1234")
- Large "SCAN BUS" button
- Interactive maintenance checklist

**Try this**:
1. Login with ID: `1234`
2. Tap "SCAN BUS"
3. Complete checklist items (tap each task)
4. Submit completed work
5. Record is written to blockchain!

### 3. Analytics Portal
**URL**: `http://localhost:3000/analytics`

**What you'll see**:
- KPI dashboard with charts
- Fuel efficiency trends
- Maintenance costs by depot
- Incident hotspots

**Try this**:
1. View the charts
2. Click "Blockchain Ledger" button
3. Search transactions
4. Click any transaction for details

---

## 📁 Project Structure

```
ksrtc/
├── contracts/
│   └── KSRTCFleet.sol              # Smart contract
├── scripts/
│   ├── deploy.js                   # Deploy script
│   └── demo.js                     # Demo script
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DepotManager/       # Manager UI
│   │   │   ├── Mechanic/           # Mechanic UI
│   │   │   └── Analytics/          # Analytics UI
│   │   ├── services/
│   │   │   └── blockchain.js       # Web3 connection
│   │   └── styles/
│   │       └── global.css          # Design system
│   ├── package.json
│   └── README.md                   # Frontend docs
├── hardhat.config.js
├── package.json
└── README.md                       # This file
```

---

## 🔥 Quick Demo (Without Frontend)

Want to see the blockchain in action without the UI?

```bash
npm run demo
```

This will:
1. Deploy the contract
2. Mint a bus (KA-01-F-1234)
3. Commission it
4. Add maintenance record
5. Add fuel record
6. Add accident record
7. Display complete history

---

## 🎨 Design System

### Color Palette
- **KSRTC Red**: `#CE2029` (brand accent)
- **Grayscale**: Black to white (10 shades)
- **Status Colors**: Green (success), Amber (warning), Red (error)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px to 32px

### Key UI Elements
- Clean, data-forward cards
- Large touch-friendly buttons (mechanics)
- Blockchain proof links on every record
- Responsive across all devices

---

## 🔧 Development

### Available Commands

**Blockchain**:
```bash
npm run compile      # Compile contracts
npm run node        # Start local blockchain
npm run deploy      # Deploy contract
npm run demo        # Run lifecycle demo
```

**Frontend**:
```bash
cd frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Environment Setup

The system works out of the box with local Hardhat network. For production:

1. Update `hardhat.config.js` with your network
2. Update `frontend/src/services/blockchain.js` with contract address
3. Configure wallet connection in frontend

---

## 📊 System Features

### Smart Contract Features
✅ ERC-721 NFT standard  
✅ Bus minting & commissioning  
✅ Maintenance records with spare parts  
✅ Fuel consumption tracking  
✅ Accident records with IPFS hashes  
✅ Complete audit trail  
✅ Event emissions for off-chain monitoring  

### Depot Manager Features
✅ Fleet dashboard with metrics  
✅ Searchable bus list  
✅ Individual bus passport view  
✅ Tabbed history display  
✅ Blockchain verification links  
✅ Critical alerts  
✅ Quick actions  

### Mechanic App Features
✅ Simple employee login  
✅ QR bus scanning (simulated)  
✅ Interactive checklist  
✅ Part scanning requirement  
✅ Progress tracking  
✅ Blockchain submission  

### Analytics Features
✅ Executive KPI dashboard  
✅ Fuel efficiency charts  
✅ Maintenance cost analysis  
✅ Incident hotspot maps  
✅ Blockchain ledger explorer  
✅ Transaction search  
✅ Full audit capabilities  

---

## 🔒 Security & Verification

- All write operations require contract owner
- Records are immutable once written
- Every record has a transaction hash
- Independent verification via blockchain explorer
- IPFS hashes for document integrity
- Complete audit trail

---

## 📈 Future Roadmap

- [ ] Real QR code scanning
- [ ] Mobile apps (React Native)
- [ ] Push notifications
- [ ] Multi-signature approvals
- [ ] Role-based access control
- [ ] IoT sensor integration
- [ ] IPFS pinning service
- [ ] Multi-language support

---

## 🐛 Troubleshooting

### Frontend can't connect to blockchain
**Solution**: Ensure blockchain node is running (`npm run node`)

### Contract address not found
**Solution**: Deploy contract first (`npm run deploy`), then update address in `blockchain.js`

### Transactions failing
**Solution**: Check that you're using the owner account for write operations

### UI not loading
**Solution**: 
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📄 Documentation

- **Smart Contract**: See `contracts/KSRTCFleet.sol` for inline documentation
- **Frontend**: See `frontend/README.md` for detailed UI documentation
- **API Reference**: See `frontend/src/services/blockchain.js` for Web3 methods

---

## 🙏 Technology Stack

**Blockchain**:
- Solidity 0.8.20
- Hardhat
- OpenZeppelin (ERC-721, Ownable)
- Ethers.js

**Frontend**:
- React 18
- Vite
- React Router
- Recharts
- Lucide React (icons)

---

## 📞 Support

For issues or questions:
1. Check `frontend/README.md` for UI-specific help
2. Review smart contract comments in `KSRTCFleet.sol`
3. Examine demo script (`scripts/demo.js`) for usage examples

---

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for KSRTC Fleet Management**

🚍 Digital Vehicle Passports on Blockchain 🔗
