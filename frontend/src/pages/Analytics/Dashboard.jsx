import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Fuel,
  MapPin,
  Database
} from 'lucide-react'
import blockchainService from '../../services/blockchain'
import './Dashboard.css'

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [buses, setBuses] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    await blockchainService.connect()
    const busesData = await blockchainService.getAllBuses()
    setBuses(busesData)
    setLoading(false)
  }

  // Mock data for charts
  const fuelEfficiencyData = [
    { month: 'Jan', kmPerLiter: 5.2 },
    { month: 'Feb', kmPerLiter: 5.4 },
    { month: 'Mar', kmPerLiter: 5.1 },
    { month: 'Apr', kmPerLiter: 5.5 },
    { month: 'May', kmPerLiter: 5.3 },
    { month: 'Jun', kmPerLiter: 5.6 },
    { month: 'Jul', kmPerLiter: 5.4 },
    { month: 'Aug', kmPerLiter: 5.7 },
    { month: 'Sep', kmPerLiter: 5.5 },
    { month: 'Oct', kmPerLiter: 5.8 },
    { month: 'Nov', kmPerLiter: 5.6 },
  ]

  const maintenanceCostData = [
    { depot: 'Central', cost: 125000 },
    { depot: 'North', cost: 98000 },
    { depot: 'South', cost: 110000 },
    { depot: 'East', cost: 87000 },
    { depot: 'West', cost: 95000 },
  ]

  const busModelDistribution = [
    { name: 'Volvo B7R', value: 35, color: '#CE2029' },
    { name: 'Tata Marcopolo', value: 25, color: '#404040' },
    { name: 'Ashok Leyland', value: 20, color: '#6B6B6B' },
    { name: 'BYD Electric', value: 15, color: '#8C8C8C' },
    { name: 'Others', value: 5, color: '#B8B8B8' },
  ]

  const incidentHotspots = [
    { location: 'Bangalore-Mysore Highway, KM 45', incidents: 8 },
    { location: 'Bangalore-Chennai Highway, KM 30', incidents: 6 },
    { location: 'Hosur Road Junction', incidents: 5 },
    { location: 'Tumkur Road, KM 20', incidents: 4 },
    { location: 'Electronic City Circle', incidents: 3 },
  ]

  const stats = [
    {
      label: 'Avg Fuel Efficiency',
      value: '5.6 km/L',
      icon: Fuel,
      color: '#059669',
      bgColor: '#D1FAE5',
      trend: '+8% vs last month'
    },
    {
      label: 'Total Maintenance Cost',
      value: '₹5.15L',
      icon: Activity,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      trend: '-12% vs last month'
    },
    {
      label: 'Incident Rate',
      value: '2.1%',
      icon: AlertTriangle,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      trend: '-0.3% vs last month'
    },
    {
      label: 'Blockchain Records',
      value: buses.length * 15 || 0,
      icon: Database,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      trend: 'All verified'
    },
  ]

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="header-title">KSRTC Analytics Portal</h1>
              <p className="header-subtitle">Fleet-Wide Insights & Performance Metrics</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/depot')}>
                Depot Dashboard
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/analytics/ledger')}>
                <Database size={18} />
                Blockchain Ledger
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container analytics-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Key Stats */}
            <div className="stats-grid grid grid-4">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card card">
                  <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-trend">{stat.trend}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Fuel Efficiency Trend */}
              <div className="chart-card card">
                <h2 className="card-header">
                  <TrendingUp size={20} />
                  Fleet-Wide Fuel Efficiency Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fuelEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                    <XAxis dataKey="month" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="kmPerLiter" 
                      stroke="#CE2029" 
                      strokeWidth={3}
                      name="km/Liter"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Maintenance Costs */}
              <div className="chart-card card">
                <h2 className="card-header">
                  <Activity size={20} />
                  Maintenance Costs by Depot
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={maintenanceCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                    <XAxis dataKey="depot" stroke="#6B6B6B" />
                    <YAxis stroke="#6B6B6B" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cost" fill="#CE2029" name="Cost (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bus Model Distribution */}
              <div className="chart-card card">
                <h2 className="card-header">
                  Fleet Composition by Model
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={busModelDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} (${entry.value}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {busModelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Incident Hotspots */}
              <div className="chart-card card">
                <h2 className="card-header">
                  <MapPin size={20} />
                  Incident Hotspot Locations
                </h2>
                <div className="hotspot-list">
                  {incidentHotspots.map((hotspot, index) => (
                    <div key={index} className="hotspot-item">
                      <div className="hotspot-info">
                        <span className="hotspot-rank">#{index + 1}</span>
                        <span className="hotspot-location">{hotspot.location}</span>
                      </div>
                      <div className="hotspot-bar-container">
                        <div 
                          className="hotspot-bar" 
                          style={{ width: `${(hotspot.incidents / 8) * 100}%` }}
                        />
                        <span className="hotspot-count">{hotspot.incidents}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="insights-section">
              <div className="card">
                <h2 className="card-header">Key Insights</h2>
                <div className="insights-list">
                  <div className="insight-item">
                    <div className="insight-icon success">✓</div>
                    <div>
                      <strong>Fuel efficiency improved by 8%</strong>
                      <p>Recent driver training programs showing positive results</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon warning">⚠</div>
                    <div>
                      <strong>Bangalore-Mysore Highway requires attention</strong>
                      <p>8 incidents reported in the last quarter at KM 45</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon info">ℹ</div>
                    <div>
                      <strong>All records verified on blockchain</strong>
                      <p>{buses.length * 15} immutable transactions recorded this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
