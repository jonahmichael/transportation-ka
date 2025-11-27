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
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    onRoute: 0,
    inWorkshop: 0,
    awaitingService: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const connected = await blockchainService.connect()
    if (connected) {
      const busesData = await blockchainService.getAllBuses()
      setBuses(busesData)
      
      // Calculate stats (mock data for status)
      setStats({
        total: busesData.length,
        onRoute: Math.floor(busesData.length * 0.75),
        inWorkshop: Math.floor(busesData.length * 0.15),
        awaitingService: Math.floor(busesData.length * 0.10)
      })
    }
    setLoading(false)
  }

  const getLastOdometer = (bus) => {
    // Get most recent odometer reading from maintenance or fuel records
    return bus.initialOdometer || 0
  }

  const getStatus = (index) => {
    // Mock status based on index
    if (index % 10 < 7) return { label: 'On Route', class: 'badge-success' }
    if (index % 10 < 9) return { label: 'In Workshop', class: 'badge-warning' }
    return { label: 'Awaiting Service', class: 'badge-error' }
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
                    <button className="action-btn btn btn-secondary">
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
