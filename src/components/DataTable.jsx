export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  emptyMessage = 'No data found'
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className="px-6 py-3 text-sm text-gray-900"
                  >
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-3 text-sm space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
