import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { getStats } from '../api/endpoints'
import '../styles/admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await getStats()
      setStats(response.data)
    } catch (err) {
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <p className="error">{error}</p>

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats?.totalProducts || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats?.totalRevenue.toFixed(2) || '0.00'}</p>
          </div>

          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="admin-actions">
          <a href="/admin/products" className="action-btn">
            Manage Products
          </a>
          <a href="/admin/orders" className="action-btn">
            View Orders
          </a>
        </div>
      </div>
    </div>
  )
}
