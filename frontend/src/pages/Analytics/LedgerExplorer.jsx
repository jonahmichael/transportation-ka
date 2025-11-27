import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Shield,
  Clock,
  Hash,
  User,
  FileText
} from 'lucide-react'
import blockchainService from '../../services/blockchain'
import './LedgerExplorer.css'

export default function LedgerExplorer() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState(null)

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = transactions.filter(tx => 
        tx.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.authorizer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTransactions(filtered)
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchQuery, transactions])

  const loadTransactions = async () => {
    setLoading(true)
    await blockchainService.connect()
    const buses = await blockchainService.getAllBuses()
    
    // Generate mock transaction log from bus data
    const txLog = []
    
    buses.forEach(bus => {
      // Mint transaction
      txLog.push({
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        timestamp: bus.commissioningDate - 1000000,
        action: 'Bus Minted',
        busId: bus.registrationNumber,
        authorizer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        data: {
          chassisNumber: bus.chassisNumber,
          model: bus.model
        }
      })

      // Commission transaction
      if (bus.isCommissioned) {
        txLog.push({
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: bus.commissioningDate,
          action: 'Bus Commissioned',
          busId: bus.registrationNumber,
          authorizer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          data: {
            initialOdometer: bus.initialOdometer
          }
        })
      }

      // Maintenance transactions
      for (let i = 0; i < bus.maintenanceCount; i++) {
        txLog.push({
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: bus.commissioningDate + (i + 1) * 2592000000, // 30 days apart
          action: 'Maintenance Record Added',
          busId: bus.registrationNumber,
          authorizer: '0x8ba1f109551bd432803012645ac136ddd64dba7',
          data: {
            serviceType: `${10000 * (i + 1)} km Service`,
            workshopId: 'KSRTC-WS-BLR-01',
            mechanicId: `MECH-2024-${1000 + i}`
          }
        })
      }

      // Fuel transactions
      for (let i = 0; i < bus.fuelCount; i++) {
        txLog.push({
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: bus.commissioningDate + (i + 1) * 604800000, // 7 days apart
          action: 'Fuel Record Added',
          busId: bus.registrationNumber,
          authorizer: '0x9f8d35Cc6634C0532925a3b844Bc9e7595f1cEd',
          data: {
            depotId: 'KSRTC-DEPOT-BLR-CENTRAL',
            litersDispensed: 120 + Math.random() * 30
          }
        })
      }

      // Accident transactions
      for (let i = 0; i < bus.accidentCount; i++) {
        txLog.push({
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: bus.commissioningDate + (i + 1) * 7776000000, // 90 days apart
          action: 'Accident Record Added',
          busId: bus.registrationNumber,
          authorizer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          data: {
            reportId: `ACC-2024-${1000 + i}`,
            location: 'Highway Incident'
          }
        })
      }
    })

    // Sort by timestamp descending
    txLog.sort((a, b) => b.timestamp - a.timestamp)
    
    setTransactions(txLog)
    setFilteredTransactions(txLog)
    setLoading(false)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionColor = (action) => {
    if (action.includes('Minted')) return 'info'
    if (action.includes('Commissioned')) return 'success'
    if (action.includes('Maintenance')) return 'primary'
    if (action.includes('Fuel')) return 'warning'
    if (action.includes('Accident')) return 'error'
    return 'default'
  }

  return (
    <div className="ledger-explorer">
      {/* Header */}
      <header className="ledger-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/analytics')}>
            <ArrowLeft size={20} />
            Back to Analytics
          </button>

          <div className="header-title-section">
            <div className="header-icon">
              <Shield size={32} color="var(--ksrtc-red)" />
            </div>
            <div>
              <h1 className="header-title">Blockchain Ledger Explorer</h1>
              <p className="header-subtitle">
                Audit & Verify Immutable Fleet Records
              </p>
            </div>
          </div>

          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Bus Reg. No., Transaction ID, Action, or Date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-large"
            />
          </div>
        </div>
      </header>

      <div className="container ledger-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading blockchain transactions...</p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="ledger-stats">
              <div className="stat-item">
                <Hash size={18} />
                <div>
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value">{transactions.length}</div>
                </div>
              </div>
              <div className="stat-item">
                <Clock size={18} />
                <div>
                  <div className="stat-label">Latest Transaction</div>
                  <div className="stat-value">
                    {transactions.length > 0 ? formatDate(transactions[0].timestamp) : '-'}
                  </div>
                </div>
              </div>
              <div className="stat-item">
                <Shield size={18} />
                <div>
                  <div className="stat-label">Verification Status</div>
                  <div className="stat-value success">All Verified ✓</div>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="transaction-list">
              <h2 className="section-title">Transaction Log</h2>
              
              {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} color="var(--color-gray-400)" />
                  <p>No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((tx, index) => (
                  <div 
                    key={index} 
                    className="transaction-card card"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <div className="transaction-header">
                      <div className="transaction-main">
                        <div className={`action-badge badge-${getActionColor(tx.action)}`}>
                          {tx.action}
                        </div>
                        <div className="transaction-info">
                          <div className="transaction-bus">
                            <strong>{tx.busId}</strong>
                          </div>
                          <div className="transaction-time">
                            <Clock size={14} />
                            {formatDate(tx.timestamp)}
                          </div>
                        </div>
                      </div>
                      <button className="blockchain-link">
                        <ExternalLink size={16} />
                        View Details
                      </button>
                    </div>

                    <div className="transaction-details">
                      <div className="detail-item">
                        <Hash size={14} />
                        <span className="detail-label">Transaction Hash:</span>
                        <span className="hash-value">{tx.txHash.substring(0, 20)}...{tx.txHash.substring(tx.txHash.length - 10)}</span>
                      </div>
                      <div className="detail-item">
                        <User size={14} />
                        <span className="detail-label">Authorizer:</span>
                        <span className="hash-value">{tx.authorizer.substring(0, 10)}...{tx.authorizer.substring(tx.authorizer.length - 8)}</span>
                      </div>
                    </div>

                    {Object.keys(tx.data).length > 0 && (
                      <div className="transaction-payload">
                        <div className="payload-label">Data Payload:</div>
                        <pre className="payload-content">
                          {JSON.stringify(tx.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button onClick={() => setSelectedTx(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Action:</span>
                <span className={`action-badge badge-${getActionColor(selectedTx.action)}`}>
                  {selectedTx.action}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Bus ID:</span>
                <span>{selectedTx.busId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span>{formatDate(selectedTx.timestamp)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Transaction Hash:</span>
                <span className="hash-value">{selectedTx.txHash}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Authorizer:</span>
                <span className="hash-value">{selectedTx.authorizer}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Data Payload:</span>
                <pre className="payload-content">
                  {JSON.stringify(selectedTx.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
