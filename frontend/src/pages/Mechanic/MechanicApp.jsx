import { useState, useEffect, useRef } from 'react'
import { 
  QrCode, 
  CheckCircle2, 
  Circle, 
  Camera,
  Wrench,
  User,
  LogOut
} from 'lucide-react'
import blockchainService from '../../services/blockchain'
import './MechanicApp.css'

export default function MechanicApp() {
  const [mechanicId, setMechanicId] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mechanicName, setMechanicName] = useState('')
  const [scannedBus, setScannedBus] = useState(null)
  const [activeJob, setActiveJob] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showScanner, setShowScanner] = useState(false)
  const videoRef = useRef(null)

  // Mock login
  const handleLogin = () => {
    if (mechanicId.length >= 4) {
      setIsLoggedIn(true)
      setMechanicName(`Mechanic #${mechanicId}`)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setMechanicId('')
    setScannedBus(null)
    setActiveJob(null)
  }

  // Mock QR scan - in real app, use html5-qrcode library
  const handleScanBus = () => {
    // Simulate QR scan result
    const mockBusId = 1
    loadBusJob(mockBusId)
  }

  const loadBusJob = async (tokenId) => {
    await blockchainService.connect()
    const busData = await blockchainService.getBusDetails(tokenId)
    
    setScannedBus(busData)
    setActiveJob({
      busId: tokenId,
      registrationNumber: busData.registrationNumber,
      serviceType: '80,000km Scheduled Service',
      workshopId: 'KSRTC-WS-BLR-01'
    })

    // Initialize task checklist
    setTasks([
      { id: 1, name: 'Inspect Brake System', completed: false, requiresPart: false },
      { id: 2, name: 'Check Suspension', completed: false, requiresPart: false },
      { id: 3, name: 'Change Engine Oil', completed: false, requiresPart: true, partScanned: false },
      { id: 4, name: 'Replace Air Filter', completed: false, requiresPart: true, partScanned: false },
      { id: 5, name: 'Replace Oil Filter', completed: false, requiresPart: true, partScanned: false },
      { id: 6, name: 'Check Battery Terminals', completed: false, requiresPart: false },
      { id: 7, name: 'Inspect Tires & Pressure', completed: false, requiresPart: false },
      { id: 8, name: 'Test All Lights', completed: false, requiresPart: false },
      { id: 9, name: 'Check Coolant Level', completed: false, requiresPart: false },
      { id: 10, name: 'Lubricate Moving Parts', completed: false, requiresPart: false },
    ])

    setShowScanner(false)
  }

  const handleTaskToggle = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    
    if (task.requiresPart && !task.partScanned) {
      // Show part scanning modal
      alert('Please scan the QR code on the spare part box')
      scanPart(taskId)
    } else {
      // Toggle task completion
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ))
    }
  }

  const scanPart = (taskId) => {
    // Simulate part scan
    setTimeout(() => {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, partScanned: true, completed: true } : t
      ))
    }, 500)
  }

  const handleSubmit = async () => {
    if (tasks.every(t => t.completed)) {
      const confirmSubmit = window.confirm(
        'Submit this maintenance record for supervisor review?\n\n' +
        'This will create an immutable record on the blockchain.'
      )

      if (confirmSubmit) {
        try {
          // Get scanned parts
          const sparePartsUsed = tasks
            .filter(t => t.requiresPart)
            .map(t => `PART-${t.id}-${Date.now()}`)

          await blockchainService.addMaintenanceRecord(
            scannedBus.tokenId,
            activeJob.serviceType,
            activeJob.workshopId,
            mechanicId,
            'SUPV-2024-1234', // Mock supervisor ID
            sparePartsUsed,
            scannedBus.initialOdometer + 80000 // Mock odometer
          )

          alert('✅ Maintenance record submitted successfully!\n\nThe record has been added to the blockchain.')
          
          // Reset
          setScannedBus(null)
          setActiveJob(null)
          setTasks([])
        } catch (error) {
          alert('❌ Error submitting maintenance record:\n' + error.message)
        }
      }
    }
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const allCompleted = completedTasks === totalTasks

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="mechanic-app login-screen">
        <div className="login-container">
          <div className="login-header">
            <Wrench size={64} color="var(--ksrtc-red)" />
            <h1>KSRTC Workshop</h1>
            <p>Mechanic Login</p>
          </div>

          <div className="login-form">
            <label>Enter Employee ID</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 4-digit ID"
              value={mechanicId}
              onChange={(e) => setMechanicId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="login-input"
              autoFocus
            />
            <button 
              className="btn btn-primary btn-large"
              onClick={handleLogin}
              disabled={mechanicId.length < 4}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Home Screen (No Active Job)
  if (!activeJob) {
    return (
      <div className="mechanic-app">
        <header className="mechanic-header">
          <div className="header-left">
            <User size={24} />
            <div>
              <h2>{mechanicName}</h2>
              <p className="header-subtitle">Central Workshop, Bangalore</p>
            </div>
          </div>
          <button className="btn-icon" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </header>

        <div className="home-container">
          <button className="scan-btn" onClick={handleScanBus}>
            <QrCode size={80} />
            <span>SCAN BUS</span>
          </button>

          <div className="assigned-jobs">
            <h3>Assigned Jobs for Today</h3>
            <div className="job-list">
              <div className="job-card">
                <div className="job-info">
                  <strong>KA-01-F-1234</strong>
                  <span>80,000 km Service</span>
                </div>
                <button className="btn btn-secondary" onClick={handleScanBus}>
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active Job Screen
  return (
    <div className="mechanic-app">
      <header className="mechanic-header">
        <div className="header-left">
          <User size={24} />
          <div>
            <h2>{mechanicName}</h2>
            <p className="header-subtitle">Working on: {activeJob.registrationNumber}</p>
          </div>
        </div>
        <button className="btn-icon" onClick={() => setActiveJob(null)}>
          <LogOut size={20} />
        </button>
      </header>

      <div className="job-container">
        {/* Job Info */}
        <div className="job-info-card">
          <div>
            <h2>{activeJob.registrationNumber}</h2>
            <p className="job-type">{activeJob.serviceType}</p>
          </div>
          <div className="progress-circle">
            <svg width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="var(--color-gray-200)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="var(--ksrtc-red)"
                strokeWidth="6"
                strokeDasharray={`${(completedTasks / totalTasks) * 220} 220`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="progress-text">
              <strong>{completedTasks}/{totalTasks}</strong>
            </div>
          </div>
        </div>

        {/* Task Checklist */}
        <div className="checklist">
          <h3>Service Checklist</h3>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`checklist-item ${task.completed ? 'completed' : ''}`}
              onClick={() => handleTaskToggle(task.id)}
            >
              <div className="checkbox">
                {task.completed ? (
                  <CheckCircle2 size={28} color="var(--color-success)" />
                ) : (
                  <Circle size={28} color="var(--color-gray-400)" />
                )}
              </div>
              <div className="task-info">
                <span className="task-name">{task.name}</span>
                {task.requiresPart && !task.partScanned && (
                  <span className="task-badge">
                    <Camera size={12} /> Scan Part Required
                  </span>
                )}
                {task.requiresPart && task.partScanned && (
                  <span className="task-badge success">
                    ✓ Part Scanned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {allCompleted && (
          <button 
            className="btn btn-primary btn-large submit-btn"
            onClick={handleSubmit}
          >
            <CheckCircle2 size={24} />
            SUBMIT FOR SUPERVISOR REVIEW
          </button>
        )}
      </div>
    </div>
  )
}
