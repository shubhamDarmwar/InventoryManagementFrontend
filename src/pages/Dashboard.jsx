import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { statService } from '../services/services'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStocks: 0,
    lowStockItems: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await statService.getStats()
      
      setStats({
        totalProducts: response.data?.totalProducts || 0,
        totalCategories: response.data?.totalCategories || 0,
        totalStocks: response.data?.totalStocks || 0,
        lowStockItems: response.data?.lowStockItems || 0
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role?.name === 'ADMIN' || user?.roleName === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
            {isAdmin && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">ADMIN</span>}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white px-4 py-3 hover:bg-gray-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/products')}
              className="text-white px-4 py-3 hover:bg-gray-700 transition"
            >
              Products
            </button>
            <button
              onClick={() => navigate('/categories')}
              className="text-white px-4 py-3 hover:bg-gray-700 transition"
            >
              Categories
            </button>
            <button
              onClick={() => navigate('/stock')}
              className="text-white px-4 py-3 hover:bg-gray-700 transition"
            >
              Stock
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/users')}
                  className="text-white px-4 py-3 hover:bg-gray-700 transition"
                >
                  Users
                </button>
                <button
                  onClick={() => navigate('/roles')}
                  className="text-white px-4 py-3 hover:bg-gray-700 transition"
                >
                  Roles
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Card - Total Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-blue-500">{stats.totalProducts}</p>
              <p className="text-sm text-gray-500 mt-2">Active products in inventory</p>
            </div>

            {/* Stats Card - Total Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Categories</h3>
              <p className="text-3xl font-bold text-green-500">{stats.totalCategories}</p>
              <p className="text-sm text-gray-500 mt-2">Product categories</p>
            </div>

            {/* Stats Card - Total Stock */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Items</h3>
              <p className="text-3xl font-bold text-purple-500">{stats.totalStocks}</p>
              <p className="text-sm text-gray-500 mt-2">Items in storage</p>
            </div>

            {/* Stats Card - Low Stock Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock Items</h3>
              <p className="text-3xl font-bold text-orange-500">{stats.lowStockItems}</p>
              <p className="text-sm text-gray-500 mt-2">Items below 10 units</p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Admin Controls</h3>
            <p className="text-blue-700 mb-4">
              You have administrative access. Use the navigation menu above to manage users, roles, and permissions.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
