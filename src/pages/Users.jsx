import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/services'
import { useAuthStore } from '../store/authStore'
import { showSuccess, showError } from '../utils/toast'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null
  })
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role?.name === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard')
    } else {
      fetchUsers()
    }
  }, [isAdmin, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers({ pageSize: 100 })
      setUsers(response.data?.content || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch users'
      showError(errorMsg)
    } finally {
      setLoading(false)
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
      await userService.deleteUser(itemId)
      showSuccess('User deleted successfully!')
      fetchUsers()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user'
      showError(errorMsg)
    } finally {
      setDeleteLoading(null)
      setConfirmDialog({ isOpen: false, itemId: null })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
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
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {u.role?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteClick(u.id)}
                          disabled={deleteLoading === u.id}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium disabled:opacity-50"
                        >
                          {deleteLoading === u.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
