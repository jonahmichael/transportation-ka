# SURAKSHA CHAIN - Frontend UI

Complete role-based user interface for the KSRTC Fleet Management System.

## 🎨 UI Overview

The frontend consists of three distinct role-based interfaces:

### 1. **Depot Manager Dashboard** (`/depot`)
- Fleet overview with real-time metrics
- Searchable bus list with status indicators
- Critical alerts and quick actions
- Detailed bus passport view with tabbed interface
- Complete maintenance, fuel, and accident history
- Blockchain proof links for every record

### 2. **Workshop Mechanic App** (`/mechanic`)
- Mobile-optimized, tablet-friendly interface
- Simple employee ID login
- Large QR code scanner button for bus identification
- Interactive maintenance checklist
- Part scanning requirement for spare parts
- One-click submission to blockchain

### 3. **Analytics Portal** (`/analytics`)
- Executive dashboard with KPI metrics
- Interactive charts (fuel efficiency, maintenance costs, fleet composition)
- Incident hotspot analysis
- Blockchain ledger explorer with transaction search
- Full audit trail with transaction details

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Hardhat blockchain running (from parent directory)

### Installation

```bash
cd frontend
npm install
```

### Running the Applications

#### Start All Interfaces (Development Mode)
```bash
npm run dev
```
This will start on `http://localhost:3000`

#### Start Individual Interfaces
```bash
# Depot Manager Dashboard (Port 3000)
npm run depot-manager

# Mechanic App (Port 3001)
npm run mechanic-app

# Analytics Portal (Port 3002)
npm run analytics
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎯 User Flows

### Depot Manager Workflow
1. View fleet dashboard with key metrics
2. Search/filter buses by registration or model
3. Click on any bus to view its Digital Passport
4. Navigate through tabs (Maintenance, Fuel, Accidents)
5. Click blockchain proof icons to verify transactions
6. Access Analytics Portal for fleet-wide insights

### Mechanic Workflow
1. Login with 4-digit employee ID
2. Tap large "SCAN BUS" button
3. View assigned maintenance job
4. Complete interactive checklist
5. For parts replacement: scan spare part QR codes
6. Submit completed work for supervisor review
7. Record is written to blockchain immutably

### Executive/Auditor Workflow
1. View analytics dashboard with charts
2. Analyze fuel efficiency trends
3. Review maintenance costs by depot
4. Identify incident hotspots
5. Access Blockchain Ledger Explorer
6. Search transactions by various criteria
7. Verify any record independently

---

## 🎨 Design System

### Color Palette
- **Primary Red**: `#CE2029` (KSRTC brand color)
- **Grayscale**: Black, white, and 10 shades of gray
- **Status Colors**:
  - Success: `#059669` (green)
  - Warning: `#F59E0B` (amber)
  - Error: `#CE2029` (red)
  - Info: `#3B82F6` (blue)

### Typography
- **Font**: Inter (from Google Fonts)
- **Sizes**: xs (12px) to 3xl (32px)
- **Weights**: 300-700

### Components
- **Cards**: White background, rounded corners, subtle shadows
- **Buttons**: Primary (red) and Secondary (gray)
- **Badges**: Colored status indicators
- **Tables**: Sortable, hoverable rows
- **Charts**: Using Recharts library

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── DepotManager/
│   │   │   ├── Dashboard.jsx       # Main depot dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── BusPassport.jsx     # Individual bus view
│   │   │   └── BusPassport.css
│   │   ├── Mechanic/
│   │   │   ├── MechanicApp.jsx     # Tablet interface
│   │   │   └── MechanicApp.css
│   │   └── Analytics/
│   │       ├── Dashboard.jsx       # Analytics charts
│   │       ├── Dashboard.css
│   │       ├── LedgerExplorer.jsx  # Blockchain audit tool
│   │       └── LedgerExplorer.css
│   ├── services/
│   │   └── blockchain.js           # Web3 integration
│   ├── styles/
│   │   └── global.css              # Design system
│   ├── App.jsx                     # Router configuration
│   └── main.jsx                    # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔗 Blockchain Integration

The UI connects to the smart contract via `src/services/blockchain.js`:

### Key Functions
- `connect()` - Initialize Web3 provider
- `getAllBuses()` - Fetch all buses from blockchain
- `getBusDetails(tokenId)` - Get complete bus passport
- `addMaintenanceRecord()` - Submit maintenance event
- `addFuelRecord()` - Log fuel consumption
- `addAccidentRecord()` - Record accident

### Configuration
Update the contract address in `blockchain.js`:
```javascript
const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'
```

---

## 📱 Responsive Design

All interfaces are fully responsive:

- **Desktop**: Full-width layouts with multi-column grids
- **Tablet**: Optimized for 768px-1024px (ideal for mechanics)
- **Mobile**: Single-column stacked layouts

### Breakpoints
- Small: < 768px
- Medium: 768px - 1024px
- Large: > 1024px

---

## 🔒 Security Features

- Owner-only write operations to blockchain
- All records are immutable once written
- Transaction hashes for independent verification
- IPFS hashes for off-chain document storage
- Audit trail for all actions

---

## 🛠️ Development

### Environment Variables (Optional)
Create `.env` file:
```
VITE_CONTRACT_ADDRESS=0xYourAddress
VITE_RPC_URL=http://localhost:8545
```

### Hot Reload
Vite provides instant hot module replacement during development.

### Debugging
- Open browser DevTools
- React DevTools extension recommended
- Check console for blockchain connection status

---

## 📊 Features Checklist

### Depot Manager Dashboard
- ✅ Fleet overview with 4 key metrics
- ✅ Bus list table with sorting
- ✅ Critical alerts section
- ✅ Quick actions (commission bus, generate report)
- ✅ Search functionality
- ✅ Individual bus passport view
- ✅ Tabbed history (maintenance, fuel, accidents)
- ✅ Blockchain proof links

### Mechanic App
- ✅ Employee ID login
- ✅ Large QR scan button
- ✅ Assigned jobs list
- ✅ Interactive checklist (10 tasks)
- ✅ Part scanning requirement
- ✅ Visual progress indicator
- ✅ Blockchain submission

### Analytics Portal
- ✅ 4 KPI stat cards
- ✅ Fuel efficiency line chart
- ✅ Maintenance costs bar chart
- ✅ Fleet composition pie chart
- ✅ Incident hotspots ranking
- ✅ Key insights section
- ✅ Blockchain ledger explorer
- ✅ Transaction search
- ✅ Transaction detail modal

---

## 🎯 Future Enhancements

- Real QR code scanning using device camera
- Push notifications for mechanics
- Real-time updates via WebSocket
- Mobile apps (React Native)
- Multi-language support
- Dark mode
- Export reports to PDF
- Integration with IPFS for document storage
- Biometric authentication

---

## 📄 License

MIT License - Part of SURAKSHA CHAIN project

---

## 🙏 Acknowledgments

- **React** - UI framework
- **Vite** - Build tool
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **Ethers.js** - Blockchain interaction

---

**Built with ❤️ for KSRTC**
