import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { getProducts, deleteProduct } from '../api/endpoints'
import '../styles/admin.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(id)
        setProducts(products.filter((p) => p.id !== id))
        alert('Product deleted')
      } catch (err) {
        alert('Failed to delete product')
      }
    }
  }

  if (loading) return <Loading />
  if (error) return <p className="error">{error}</p>

  return (
    <div className="admin-products">
      <div className="container">
        <div className="admin-header">
          <h1>Manage Products</h1>
          <a href="/admin/products/new" className="btn btn-primary">
            Add New Product
          </a>
        </div>

        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td className="actions">
                    <a href={`/admin/products/${product.id}`} className="btn btn-sm">
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
