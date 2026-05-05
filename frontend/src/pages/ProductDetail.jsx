import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { getProduct, addToCart } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import '../styles/productdetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const { fetchCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await getProduct(id)
      setProduct(response.data)
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      await fetchCart()
      setMessage('Added to cart successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to add to cart')
    }
  }

  if (loading) return <Loading />
  if (error) return <p className="error">{error}</p>
  if (!product) return <p>Product not found</p>

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="description">{product.description}</p>

            <div className="detail-meta">
              <div className="price">${product.price.toFixed(2)}</div>
              <div className="rating">⭐ {product.rating} (based on reviews)</div>
              <div className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
            </div>

            {message && <p className="success-message">{message}</p>}

            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
