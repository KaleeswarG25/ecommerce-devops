import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { getProducts, addToCart } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import '../styles/home.css'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { fetchCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts()
      setFeaturedProducts(response.data.slice(0, 8))
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      await addToCart(productId, 1)
      await fetchCart()
      alert('Added to cart!')
    } catch (err) {
      setError('Failed to add to cart')
    }
  }

  return (
    <div className="home">
      <Hero />

      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {['Electronics', 'Apparel', 'Accessories', 'Furniture'].map((cat) => (
              <div key={cat} className="category-card">
                <h3>{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <Loading />
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
