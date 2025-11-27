import { Routes, Route, Navigate } from 'react-router-dom'
import DepotManagerDashboard from './pages/DepotManager/Dashboard'
import BusPassport from './pages/DepotManager/BusPassport'
import MechanicApp from './pages/Mechanic/MechanicApp'
import AnalyticsDashboard from './pages/Analytics/Dashboard'
import LedgerExplorer from './pages/Analytics/LedgerExplorer'

function App() {
  return (
    <Routes>
      {/* Depot Manager Routes */}
      <Route path="/depot" element={<DepotManagerDashboard />} />
      <Route path="/depot/bus/:tokenId" element={<BusPassport />} />
      
      {/* Mechanic Routes */}
      <Route path="/mechanic" element={<MechanicApp />} />
      
      {/* Analytics Routes */}
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/analytics/ledger" element={<LedgerExplorer />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/depot" replace />} />
    </Routes>
  )
}

export default App
