import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/services'
import { useAuthStore } from '../store/authStore'
import { showSuccess, showError } from '../utils/toast'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingButton from '../components/LoadingButton'
import SearchBar from '../components/SearchBar'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    categoryId: ''
  })
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role?.name === 'ADMIN'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getAllProducts({ pageSize: 100 })
      setProducts(response.data?.products || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData)
        showSuccess('Product updated successfully!')
      } else {
        await productService.createProduct(formData)
        showSuccess('Product created successfully!')
      }
      setFormData({ name: '', description: '', sku: '', price: '', categoryId: '' })
      setEditingId(null)
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save product'
      showError(errorMsg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setConfirmDialog({
      isOpen: true,
      itemId: id
    })
  }

  const handleConfirmDelete = async () => {
    const { itemId } = confirmDialog
    setDeleteLoading(itemId)
    try {
      await productService.deleteProduct(itemId)
      showSuccess('Product deleted successfully!')
      fetchProducts()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product'
      showError(errorMsg)
    } finally {
      setDeleteLoading(null)
      setConfirmDialog({ isOpen: false, itemId: null })
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      categoryId: product.categoryId || ''
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setShowForm(!showForm)
              if (editingId) {
                setEditingId(null)
                setFormData({ name: '', description: '', sku: '', price: '', categoryId: '' })
              }
            }}
            className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-medium"
          >
            {showForm ? 'Cancel' : '+ Add New Product'}
          </button>
        )}

        {showForm && isAdmin && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoFocus
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="SKU *"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price *"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <LoadingButton
                type="submit"
                isLoading={submitLoading}
                className="w-full bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-medium"
              >
                Save Product
              </LoadingButton>
            </form>
          </div>
        )}

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, SKU..."
              />
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, itemId: null })}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No products found. Create your first product!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{product.sku || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{product.description || '-'}</td>
                    {isAdmin && (
                      <td className="px-6 py-3 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          disabled={deleteLoading === product.id}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium disabled:opacity-50"
                        >
                          {deleteLoading === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
