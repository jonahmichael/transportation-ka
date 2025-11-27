import { useState } from 'react'
import { X, Loader, AlertCircle } from 'lucide-react'
import './CommissionBusModal.css'

export default function CommissionBusModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    registrationNumber: '',
    chassisNumber: '',
    model: '',
    initialOdometer: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Import blockchain service
      const { default: blockchainService } = await import('../services/blockchain')
      
      // Ensure connected
      const connected = await blockchainService.connect()
      if (!connected) {
        throw new Error('Failed to connect to blockchain. Make sure the node is running.')
      }
      
      // Get current total buses to determine next token ID
      const totalBuses = await blockchainService.contract.getTotalBuses()
      const nextTokenId = Number(totalBuses) + 1
      
      // Mint bus passport
      await blockchainService.mintBusPassport(
        formData.registrationNumber,
        formData.chassisNumber,
        formData.model
      )
      
      // Commission the bus with the next token ID
      await blockchainService.commissionBus(
        nextTokenId,
        parseInt(formData.initialOdometer)
      )

      // Success
      setFormData({
        registrationNumber: '',
        chassisNumber: '',
        model: '',
        initialOdometer: ''
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error commissioning bus:', err)
      const errorMessage = err.reason || err.message || 'Failed to commission bus. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Commission New Bus</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="commission-form">
          <div className="form-group">
            <label htmlFor="registrationNumber">
              Registration Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., KA-01-F-9999"
              required
              disabled={loading}
            />
            <small className="form-hint">Format: KA-XX-X-XXXX</small>
          </div>

          <div className="form-group">
            <label htmlFor="chassisNumber">
              Chassis Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="chassisNumber"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              placeholder="e.g., CH1234567890"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">
              Bus Model <span className="required">*</span>
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Model</option>
              <option value="Tata Starbus">Tata Starbus</option>
              <option value="Ashok Leyland Viking">Ashok Leyland Viking</option>
              <option value="BYD K9 Electric">BYD K9 Electric</option>
              <option value="Volvo 8400">Volvo 8400</option>
              <option value="Mercedes-Benz O500">Mercedes-Benz O500</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="initialOdometer">
              Initial Odometer Reading (km) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="initialOdometer"
              name="initialOdometer"
              value={formData.initialOdometer}
              onChange={handleChange}
              placeholder="e.g., 0"
              min="0"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner" />
                  Commissioning...
                </>
              ) : (
                'Commission Bus'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
