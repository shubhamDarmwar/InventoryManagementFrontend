export default function StockStatusBadge({ quantity, threshold = 10 }) {
  if (quantity === 0) {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
        Out of Stock
      </span>
    )
  }
  if (quantity <= threshold) {
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
        Low Stock
      </span>
    )
  }
  return (
    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
      In Stock
    </span>
  )
}
