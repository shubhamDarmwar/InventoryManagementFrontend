import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryService } from '../services/services'
import { useAuthStore } from '../store/authStore'
import { showSuccess, showError } from '../utils/toast'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingButton from '../components/LoadingButton'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null
  })
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role?.name === 'ADMIN'

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getAllCategories({ pageSize: 100 })
      setCategories(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories'
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, formData)
        showSuccess('Category updated successfully!')
      } else {
        await categoryService.createCategory(formData)
        showSuccess('Category created successfully!')
      }
      setFormData({ name: '', description: '' })
      setEditingId(null)
      setShowForm(false)
      fetchCategories()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save category'
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
      await categoryService.deleteCategory(itemId)
      showSuccess('Category deleted successfully!')
      fetchCategories()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete category'
      showError(errorMsg)
    } finally {
      setDeleteLoading(null)
      setConfirmDialog({ isOpen: false, itemId: null })
    }
  }

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, description: cat.description })
    setEditingId(cat.id)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setShowForm(!showForm)
              if (editingId) {
                setEditingId(null)
                setFormData({ name: '', description: '' })
              }
            }}
            className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-medium"
          >
            {showForm ? 'Cancel' : '+ Add New Category'}
          </button>
        )}

        {showForm && isAdmin && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name *"
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
              <LoadingButton
                type="submit"
                isLoading={submitLoading}
                className="w-full bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-medium"
              >
                Save Category
              </LoadingButton>
            </form>
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
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
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No categories found. Create your first category!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{cat.description || 'No description'}</p>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cat.id)}
                      disabled={deleteLoading === cat.id}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium disabled:opacity-50"
                    >
                      {deleteLoading === cat.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
