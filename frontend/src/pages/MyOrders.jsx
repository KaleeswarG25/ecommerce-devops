import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { getMyOrders } from '../api/endpoints'
import '../styles/orders.css'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getMyOrders()
      setOrders(response.data)
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {error && <p className="error">{error}</p>}

        {orders.length === 0 ? (
          <p className="no-orders">No orders yet. Start shopping!</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </div>

                <div className="order-info">
                  <div className="info-item">
                    <span>Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span>Total:</span>
                    <span className="total">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} - Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
