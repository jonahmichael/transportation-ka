import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Wrench, 
  AlertTriangle, 
  Fuel,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react'
import blockchainService from '../../services/blockchain'
import './BusPassport.css'

export default function BusPassport() {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const [bus, setBus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('maintenance')

  useEffect(() => {
    loadBusData()
  }, [tokenId])

  const loadBusData = async () => {
    // Generate dummy data based on tokenId for demonstration
    const dummyBuses = {
      '1': {
        tokenId: 1,
        registrationNumber: 'KA-01-F-1234',
        chassisNumber: 'CH1234567890',
        model: 'Tata Starbus',
        isCommissioned: true,
        commissioningDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
        initialOdometer: 15000,
        maintenanceHistory: [
          { timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, serviceType: '10,000 km Service', workshopId: 'Central Workshop', mechanicId: 'Ramesh Kumar', supervisorId: 'Supervisor A. Kumar', sparePartsUsed: ['Engine Oil', 'Oil Filter', 'Air Filter'], odometerReading: 25000 },
          { timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000, serviceType: '20,000 km Service', workshopId: 'Yeshwanthpur Workshop', mechanicId: 'Suresh Patel', supervisorId: 'Supervisor B. Sharma', sparePartsUsed: ['Brake Pads', 'Brake Fluid'], odometerReading: 20000 },
          { timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000, serviceType: 'Annual Inspection', workshopId: 'Central Workshop', mechanicId: 'Mahesh Reddy', supervisorId: 'Supervisor C. Iyer', sparePartsUsed: ['Wiper Blades', 'Light Bulbs'], odometerReading: 18000 }
        ],
        accidentHistory: [],
        fuelHistory: [
          { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, depotId: 'Shantinagar', litersDispensed: 65, odometerReading: 25500 },
          { timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, depotId: 'Shantinagar', litersDispensed: 70, odometerReading: 25200 },
          { timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, depotId: 'Banashankari', litersDispensed: 68, odometerReading: 24900 }
        ]
      },
      '2': {
        tokenId: 2,
        registrationNumber: 'KA-01-F-5678',
        chassisNumber: 'CH2345678901',
        model: 'Ashok Leyland Viking',
        isCommissioned: true,
        commissioningDate: Date.now() - 400 * 24 * 60 * 60 * 1000,
        initialOdometer: 22000,
        maintenanceHistory: [
          { timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, serviceType: '40,000 km Service', workshopId: 'Banashankari Workshop', mechanicId: 'Ganesh Rao', supervisorId: 'Supervisor A. Kumar', sparePartsUsed: ['Transmission Oil', 'Coolant', 'Battery'], odometerReading: 42000 },
          { timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000, serviceType: 'PMI Service', workshopId: 'Central Workshop', mechanicId: 'Dinesh Singh', supervisorId: 'Supervisor B. Sharma', sparePartsUsed: ['Air Filter', 'Oil Filter'], odometerReading: 38000 }
        ],
        accidentHistory: [
          { timestamp: Date.now() - 120 * 24 * 60 * 60 * 1000, reportId: 'ACC-2024-1001', location: 'Electronic City Circle', description: 'Minor collision with auto-rickshaw while changing lanes', reportHash: '0x1234567890abcdef' }
        ],
        fuelHistory: [
          { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, depotId: 'Banashankari', litersDispensed: 72, odometerReading: 43000 },
          { timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, depotId: 'Kengeri', litersDispensed: 68, odometerReading: 42700 }
        ]
      }
    }
    
    // Use dummy data for the requested tokenId, or create generic data
    const dummyBus = dummyBuses[tokenId] || {
      tokenId: Number(tokenId),
      registrationNumber: `KA-0${tokenId}-F-${1000 + Number(tokenId) * 111}`,
      chassisNumber: `CH${tokenId}234567890`,
      model: ['Tata Starbus', 'Ashok Leyland Viking', 'BYD K9 Electric', 'Volvo 8400'][Number(tokenId) % 4],
      isCommissioned: true,
      commissioningDate: Date.now() - Number(tokenId) * 30 * 24 * 60 * 60 * 1000,
      initialOdometer: 10000 + Number(tokenId) * 5000,
      maintenanceHistory: [
        { timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, serviceType: '10,000 km Service', workshopId: 'Central Workshop', mechanicId: 'Ramesh Kumar', supervisorId: 'Supervisor A. Kumar', sparePartsUsed: ['Engine Oil', 'Oil Filter'], odometerReading: 20000 + Number(tokenId) * 1000 }
      ],
      accidentHistory: Number(tokenId) % 3 === 0 ? [
        { timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000, reportId: `ACC-2024-${1000 + Number(tokenId)}`, location: 'Hosur Road Junction', description: 'Minor incident during route operation', reportHash: `0x${tokenId}abcdef1234567890` }
      ] : [],
      fuelHistory: [
        { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, depotId: 'Shantinagar', litersDispensed: 65 + Number(tokenId), odometerReading: 21000 + Number(tokenId) * 1000 }
      ]
    }
    
    setBus(dummyBus)
    setLoading(false)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const showBlockchainProof = (txHash) => {
    alert(`Blockchain Transaction Hash:\n${txHash}\n\nView on Block Explorer:\nhttp://localhost:8545/tx/${txHash}`)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bus passport from blockchain...</p>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="error-container">
        <p>Bus not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/depot')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="bus-passport">
      {/* Header */}
      <header className="passport-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/depot')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="passport-title-section">
            <h1 className="passport-title">
              Digital Passport: {bus.registrationNumber}
            </h1>
            <div className="passport-subtitle">
              <span className="badge badge-success">
                {bus.isCommissioned ? 'Commissioned' : 'Not Commissioned'}
              </span>
              <span className="subtitle-text">{bus.model}</span>
            </div>
          </div>

          <div className="passport-metrics">
            <div className="metric-item">
              <Calendar size={16} />
              <span>Commissioned: {formatDate(bus.commissioningDate)}</span>
            </div>
            <div className="metric-item">
              <Gauge size={16} />
              <span>Current Odometer: {bus.initialOdometer.toLocaleString()} km</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container passport-content">
        {/* Summary Card */}
        <div className="card summary-card">
          <h2 className="card-header">Vehicle Information</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Registration Number</span>
              <span className="summary-value">{bus.registrationNumber}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Chassis Number</span>
              <span className="summary-value">{bus.chassisNumber}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Model</span>
              <span className="summary-value">{bus.model}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Token ID (NFT)</span>
              <span className="summary-value">#{bus.tokenId}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              <Wrench size={18} />
              Maintenance History ({bus.maintenanceHistory.length})
            </button>
            <button 
              className={`tab ${activeTab === 'fuel' ? 'active' : ''}`}
              onClick={() => setActiveTab('fuel')}
            >
              <Fuel size={18} />
              Fuel Log ({bus.fuelHistory.length})
            </button>
            <button 
              className={`tab ${activeTab === 'accidents' ? 'active' : ''}`}
              onClick={() => setActiveTab('accidents')}
            >
              <AlertTriangle size={18} />
              Incident Reports ({bus.accidentHistory.length})
            </button>
          </div>

          <div className="tab-content">
            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="timeline">
                {bus.maintenanceHistory.length === 0 ? (
                  <div className="empty-state">
                    <Wrench size={48} color="var(--color-gray-400)" />
                    <p>No maintenance records yet</p>
                  </div>
                ) : (
                  bus.maintenanceHistory.map((record, index) => (
                    <div key={index} className="timeline-item card">
                      <div className="timeline-header">
                        <div>
                          <h3 className="timeline-title">{record.serviceType}</h3>
                          <p className="timeline-date">{formatDate(record.timestamp)}</p>
                        </div>
                        <button 
                          className="blockchain-link"
                          onClick={() => showBlockchainProof('0x' + Math.random().toString(16).substr(2, 64))}
                        >
                          <LinkIcon size={16} />
                          Blockchain Proof
                        </button>
                      </div>
                      
                      <div className="timeline-details">
                        <div className="detail-row">
                          <span className="detail-label">Workshop:</span>
                          <span className="detail-value">{record.workshopId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Mechanic:</span>
                          <span className="detail-value">{record.mechanicId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Supervisor:</span>
                          <span className="detail-value">{record.supervisorId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Odometer:</span>
                          <span className="detail-value">{record.odometerReading.toLocaleString()} km</span>
                        </div>
                        
                        {record.sparePartsUsed.length > 0 && (
                          <div className="detail-row">
                            <span className="detail-label">Spare Parts Used:</span>
                            <div className="parts-list">
                              {record.sparePartsUsed.map((part, idx) => (
                                <span key={idx} className="part-badge">{part}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Fuel Tab */}
            {activeTab === 'fuel' && (
              <div className="timeline">
                {bus.fuelHistory.length === 0 ? (
                  <div className="empty-state">
                    <Fuel size={48} color="var(--color-gray-400)" />
                    <p>No fuel records yet</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Depot</th>
                          <th>Liters Dispensed</th>
                          <th>Odometer</th>
                          <th>Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bus.fuelHistory.map((record, index) => (
                          <tr key={index}>
                            <td>{formatDate(record.timestamp)}</td>
                            <td>{record.depotId}</td>
                            <td><strong>{record.litersDispensed.toFixed(2)}L</strong></td>
                            <td>{record.odometerReading.toLocaleString()} km</td>
                            <td>
                              <button 
                                className="blockchain-link"
                                onClick={() => showBlockchainProof('0x' + Math.random().toString(16).substr(2, 64))}
                              >
                                <LinkIcon size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Accidents Tab */}
            {activeTab === 'accidents' && (
              <div className="timeline">
                {bus.accidentHistory.length === 0 ? (
                  <div className="empty-state">
                    <AlertTriangle size={48} color="var(--color-gray-400)" />
                    <p>No incident reports</p>
                  </div>
                ) : (
                  bus.accidentHistory.map((record, index) => (
                    <div key={index} className="timeline-item card alert-warning">
                      <div className="timeline-header">
                        <div>
                          <h3 className="timeline-title">
                            <AlertTriangle size={20} />
                            {record.reportId}
                          </h3>
                          <p className="timeline-date">{formatDate(record.timestamp)}</p>
                        </div>
                        <button 
                          className="blockchain-link"
                          onClick={() => showBlockchainProof(record.reportHash)}
                        >
                          <LinkIcon size={16} />
                          View Report Hash
                        </button>
                      </div>
                      
                      <div className="timeline-details">
                        <div className="detail-row">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{record.location}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">{record.description}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">IPFS Hash:</span>
                          <span className="detail-value hash-value">
                            {record.reportHash.substring(0, 20)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
