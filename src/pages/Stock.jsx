import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { stockService } from '../services/services'
import { useAuthStore } from '../store/authStore'
import { showError } from '../utils/toast'
import StockStatusBadge from '../components/StockStatusBadge'
import SearchBar from '../components/SearchBar'

export default function Stock() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role?.name === 'ADMIN'

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await stockService.getStockSummary()
      setStocks(Array.isArray(response) ? response : response.data || [])
    } catch (err) {
      console.error('Stock fetch error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch stocks'
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Summary</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by product name, location..."
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No stocks available</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{stock.product?.name || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{stock.location?.name || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {stock.location?.locationType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{stock.quantity}</td>
                      <td className="px-6 py-3 text-sm">
                        <StockStatusBadge quantity={stock.quantity} threshold={10} />
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{stock.uom?.symbol || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(stock.updatedAt)}</td>
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
