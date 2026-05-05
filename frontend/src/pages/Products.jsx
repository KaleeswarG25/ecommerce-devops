import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { getProducts, addToCart } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import '../styles/products.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const { fetchCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [category, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts(category, sortBy)
      setProducts(response.data)
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
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          <aside className="products-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Home">Home</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Wearables">Wearables</option>
                <option value="Fitness">Fitness</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          <main className="products-main">
            {loading ? (
              <Loading />
            ) : error ? (
              <p className="error">{error}</p>
            ) : products.length === 0 ? (
              <p className="no-products">No products found</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
