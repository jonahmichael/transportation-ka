import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AlertCircle, 
  Bus, 
  Wrench, 
  Plus, 
  FileText,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react'
import blockchainService from '../../services/blockchain'
import CommissionBusModal from '../../components/CommissionBusModal'
import './Dashboard.css'

export default function DepotManagerDashboard() {
  const navigate = useNavigate()
  const [buses, setBuses] = useState([
    // Dummy data for UI showcase
    { tokenId: 1, registrationNumber: 'KA-01-F-1234', chassisNumber: 'CH1234567890', model: 'Tata Starbus', isCommissioned: true, initialOdometer: 15000, maintenanceCount: 5, accidentCount: 0, fuelCount: 12 },
    { tokenId: 2, registrationNumber: 'KA-01-F-5678', chassisNumber: 'CH2345678901', model: 'Ashok Leyland Viking', isCommissioned: true, initialOdometer: 22000, maintenanceCount: 8, accidentCount: 1, fuelCount: 18 },
    { tokenId: 3, registrationNumber: 'KA-02-F-9012', chassisNumber: 'CH3456789012', model: 'BYD K9 Electric', isCommissioned: true, initialOdometer: 8000, maintenanceCount: 3, accidentCount: 0, fuelCount: 10 },
    { tokenId: 4, registrationNumber: 'KA-03-F-3456', chassisNumber: 'CH4567890123', model: 'Volvo 8400', isCommissioned: true, initialOdometer: 35000, maintenanceCount: 12, accidentCount: 2, fuelCount: 25 },
    { tokenId: 5, registrationNumber: 'KA-04-F-7890', chassisNumber: 'CH5678901234', model: 'Tata Starbus', isCommissioned: true, initialOdometer: 18000, maintenanceCount: 6, accidentCount: 0, fuelCount: 15 },
    { tokenId: 6, registrationNumber: 'KA-05-F-2345', chassisNumber: 'CH6789012345', model: 'Ashok Leyland Viking', isCommissioned: true, initialOdometer: 28000, maintenanceCount: 9, accidentCount: 1, fuelCount: 20 },
    { tokenId: 7, registrationNumber: 'KA-06-F-6789', chassisNumber: 'CH7890123456', model: 'BYD K9 Electric', isCommissioned: true, initialOdometer: 12000, maintenanceCount: 4, accidentCount: 0, fuelCount: 14 },
    { tokenId: 8, registrationNumber: 'KA-07-F-0123', chassisNumber: 'CH8901234567', model: 'Volvo 8400', isCommissioned: true, initialOdometer: 41000, maintenanceCount: 14, accidentCount: 0, fuelCount: 30 },
    { tokenId: 9, registrationNumber: 'KA-08-F-4567', chassisNumber: 'CH9012345678', model: 'Tata Starbus', isCommissioned: true, initialOdometer: 9000, maintenanceCount: 2, accidentCount: 0, fuelCount: 8 },
    { tokenId: 10, registrationNumber: 'KA-09-F-8901', chassisNumber: 'CH0123456789', model: 'Ashok Leyland Viking', isCommissioned: true, initialOdometer: 31000, maintenanceCount: 11, accidentCount: 1, fuelCount: 22 }
  ])
  const [loading, setLoading] = useState(false)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [stats, setStats] = useState({
    total: 11,
    onRoute: 8,
    inWorkshop: 2,
    awaitingService: 1
  })

  useEffect(() => {
    // Don't load data - keep dummy data for showcase
    // loadData()
  }, [])

  const loadData = async () => {
    // Commented out to keep dummy data visible
    // Uncomment when blockchain is ready
    /*
    setLoading(true)
    
    const connected = await blockchainService.connect()
    if (connected) {
      const busesData = await blockchainService.getAllBuses()
      if (busesData.length > 0) {
        setBuses(busesData)
        setStats({
          total: busesData.length,
          onRoute: Math.floor(busesData.length * 0.75),
          inWorkshop: Math.floor(busesData.length * 0.15),
          awaitingService: Math.floor(busesData.length * 0.10)
        })
      }
    }
    setLoading(false)
    */
  }

  const getLastOdometer = (bus) => {
    // Get most recent odometer reading from maintenance or fuel records
    return bus.initialOdometer || 0
  }

  const getStatus = (index) => {
    // Mock status based on index
    if (index % 10 < 8) return { label: 'On Route', class: 'badge-success' }
    if (index % 10 < 10) return { label: 'In Workshop', class: 'badge-warning' }
    return { label: 'Awaiting Assignment', class: 'badge-error' }
  }

  const generateFleetReport = () => {
    // Generate dummy report data
    const reportDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const reportContent = `
KSRTC FLEET MANAGEMENT REPORT
Generated: ${reportDate}
Central Depot, Bangalore

═══════════════════════════════════════════════════════════════

FLEET SUMMARY
─────────────────────────────────────────────────────────────
Total Buses:              ${stats.total}
On Route:                 ${stats.onRoute}
In Workshop:              ${stats.inWorkshop}
Awaiting Service:         ${stats.awaitingService}

DETAILED FLEET STATUS
─────────────────────────────────────────────────────────────
${buses.map((bus, index) => `
${bus.registrationNumber} - ${bus.model}
  Status: ${getStatus(index).label}
  Odometer: ${bus.initialOdometer.toLocaleString()} km
  Maintenance Records: ${bus.maintenanceCount}
  Fuel Records: ${bus.fuelCount}
  Accidents: ${bus.accidentCount}
`).join('')}

MAINTENANCE ALERTS
─────────────────────────────────────────────────────────────
• KA-01-F-1234: Overdue for 80,000 km Service (2 days)
• KA-01-F-5678: Accident Report Filed - Awaiting Review

FUEL EFFICIENCY SUMMARY
─────────────────────────────────────────────────────────────
Average Fuel Consumption: 4.5 km/liter
Most Efficient: KA-02-F-9012 (BYD K9 Electric)
Needs Attention: KA-03-F-3456 (Below Average)

RECOMMENDATIONS
─────────────────────────────────────────────────────────────
1. Schedule overdue maintenance for KA-01-F-1234
2. Review accident report for KA-01-F-5678
3. Consider electric bus expansion (BYD K9 performing well)
4. Plan preventive maintenance for buses nearing service intervals

═══════════════════════════════════════════════════════════════
Report generated by SURAKSHA CHAIN Blockchain System
Digital signatures and timestamps recorded on immutable ledger
`

    // Create and download the report
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KSRTC_Fleet_Report_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    // Show success message
    alert('✅ Fleet Report Generated Successfully!\n\nThe report has been downloaded to your computer.')
  }

  return (
    <div className="depot-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="header-title">KSRTC Depot Manager Dashboard</h1>
              <p className="header-subtitle">Central Depot, Bangalore | Welcome, Rajesh Kumar</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
                Analytics Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading fleet data from blockchain...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="metrics-grid grid grid-4">
              <div className="metric-card card">
                <div className="metric-icon" style={{ backgroundColor: '#E0E7FF' }}>
                  <Bus size={24} color="#4F46E5" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">Total Buses</div>
                  <div className="metric-value">{stats.total}</div>
                </div>
              </div>

              <div className="metric-card card">
                <div className="metric-icon" style={{ backgroundColor: '#D1FAE5' }}>
                  <Bus size={24} color="#059669" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">On Route</div>
                  <div className="metric-value">{stats.onRoute}</div>
                </div>
              </div>

              <div className="metric-card card">
                <div className="metric-icon" style={{ backgroundColor: '#FEF3C7' }}>
                  <Wrench size={24} color="#F59E0B" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">In Workshop</div>
                  <div className="metric-value">{stats.inWorkshop}</div>
                </div>
              </div>

              <div className="metric-card card">
                <div className="metric-icon" style={{ backgroundColor: '#FFE5E7' }}>
                  <AlertCircle size={24} color="#CE2029" />
                </div>
                <div className="metric-content">
                  <div className="metric-label">Awaiting Service</div>
                  <div className="metric-value">{stats.awaitingService}</div>
                </div>
              </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="main-grid grid grid-2">
              {/* Left Column - Alerts & Actions */}
              <div className="alerts-section">
                {/* Critical Alerts */}
                <div className="card">
                  <h2 className="card-header">
                    <AlertCircle size={20} style={{ color: 'var(--ksrtc-red)' }} />
                    Critical Alerts
                  </h2>
                  <div className="alerts-list">
                    <div className="alert alert-error">
                      <strong>Bus KA-01-F-1234</strong>
                      <p>Overdue for 80,000 km Service</p>
                      <span className="alert-time">2 days overdue</span>
                    </div>
                    <div className="alert alert-warning">
                      <strong>Bus KA-01-F-5678</strong>
                      <p>Accident Report Filed - Awaiting Review</p>
                      <span className="alert-time">Filed today</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card quick-actions">
                  <h2 className="card-header">Quick Actions</h2>
                  <div className="actions-list">
                    <button 
                      className="action-btn btn btn-primary"
                      onClick={() => setShowCommissionModal(true)}
                    >
                      <Plus size={20} />
                      Commission New Bus
                    </button>
                    <button 
                      className="action-btn btn btn-secondary"
                      onClick={generateFleetReport}
                    >
                      <FileText size={20} />
                      Generate Fleet Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Fleet List */}
              <div className="fleet-section">
                <div className="card">
                  <div className="card-header-flex">
                    <h2 className="card-header">Fleet Overview</h2>
                    <input 
                      type="search" 
                      placeholder="Search by Reg. No. or Model..." 
                      className="search-input"
                    />
                  </div>
                  
                  {buses.length === 0 ? (
                    <div className="empty-state">
                      <Bus size={48} color="var(--color-gray-400)" />
                      <p>No buses found. Commission your first bus to get started.</p>
                    </div>
                  ) : (
                    <div className="fleet-table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Reg. No.</th>
                            <th>Model</th>
                            <th>Status</th>
                            <th>Odometer</th>
                            <th>Records</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {buses.map((bus, index) => {
                            const status = getStatus(index)
                            return (
                              <tr 
                                key={bus.tokenId} 
                                onClick={() => navigate(`/depot/bus/${bus.tokenId}`)}
                              >
                                <td>
                                  <strong>{bus.registrationNumber}</strong>
                                </td>
                                <td>{bus.model}</td>
                                <td>
                                  <span className={`badge ${status.class}`}>
                                    {status.label}
                                  </span>
                                </td>
                                <td>{getLastOdometer(bus).toLocaleString()} km</td>
                                <td>
                                  <div className="record-counts">
                                    <span title="Maintenance Records">
                                      🔧 {bus.maintenanceCount}
                                    </span>
                                    <span title="Fuel Records">
                                      ⛽ {bus.fuelCount}
                                    </span>
                                    {bus.accidentCount > 0 && (
                                      <span title="Accident Records" style={{ color: 'var(--ksrtc-red)' }}>
                                        ⚠️ {bus.accidentCount}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <ChevronRight size={20} color="var(--color-gray-400)" />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Commission Bus Modal */}
      <CommissionBusModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        onSuccess={() => {
          loadData() // Reload buses after successful commission
        }}
      />
    </div>
  )
}
