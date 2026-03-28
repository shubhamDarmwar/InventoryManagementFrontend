import api from './api'

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (userData) =>
    api.post('/auth/register', userData),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', refreshToken)
}

export const userService = {
  getAllUsers: (params) =>
    api.get('/v1/users', { params }),

  getUserById: (id) =>
    api.get(`/v1/users/${id}`),

  updateUser: (id, userData) =>
    api.put(`/v1/users/${id}`, userData),

  deleteUser: (id) =>
    api.delete(`/v1/users/${id}`),

  changePassword: (userId, passwordData) =>
    api.post(`/v1/users/${userId}/change-password`, passwordData)
}

export const productService = {
  getAllProducts: (params) =>
    api.get('/v1/products', { params }),

  getProductById: (id) =>
    api.get(`/v1/products/${id}`),

  createProduct: (productData) =>
    api.post('/v1/products', productData),

  updateProduct: (id, productData) =>
    api.put(`/v1/products/${id}`, productData),

  deleteProduct: (id) =>
    api.delete(`/v1/products/${id}`)
}

export const categoryService = {
  getAllCategories: (params) =>
    api.get('/categories', { params }),

  getCategoryById: (id) =>
    api.get(`/categories/${id}`),

  createCategory: (categoryData) =>
    api.post('/categories', categoryData),

  updateCategory: (id, categoryData) =>
    api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id) =>
    api.delete(`/categories/${id}`)
}

export const stockService = {
  getAllStocks: (params) =>
    api.get('/inventory/stock', { params }),

  getStockById: (id) =>
    api.get(`/inventory/stock/${id}`),

  getStockSummary: () =>
    api.get('/inventory/stock/summary'),

  createStock: (stockData) =>
    api.post('/inventory/stock', stockData),

  updateStock: (id, stockData) =>
    api.put(`/inventory/stock/${id}`, stockData),

  deleteStock: (id) =>
    api.delete(`/inventory/stock/${id}`)
}

export const uomService = {
  getAllUOMTypes: (params) =>
    api.get('/uoms', { params }),

  getUOMTypeById: (id) =>
    api.get(`/uoms/${id}`),

  createUOMType: (uomData) =>
    api.post('/uoms', uomData),

  updateUOMType: (id, uomData) =>
    api.put(`/uoms/${id}`, uomData),

  deleteUOMType: (id) =>
    api.delete(`/uoms/${id}`)
}

export const locationService = {
  getAllLocations: (params) =>
    api.get('/locations', { params }),

  getLocationById: (id) =>
    api.get(`/locations/${id}`),

  createLocation: (locationData) =>
    api.post('/locations', locationData),

  updateLocation: (id, locationData) =>
    api.put(`/locations/${id}`, locationData),

  deleteLocation: (id) =>
    api.delete(`/locations/${id}`)
}

export const roleService = {
  getAllRoles: (params) =>
    api.get('/v1/roles', { params }),

  getRoleById: (id) =>
    api.get(`/v1/roles/${id}`),

  createRole: (roleData) =>
    api.post('/v1/roles', roleData),

  updateRole: (id, roleData) =>
    api.put(`/v1/roles/${id}`, roleData),

  deleteRole: (id) =>
    api.delete(`/v1/roles/${id}`)
}

export const statService = {
  getStats: () =>
    api.get('/v1/stats')
}

// Note: Permission endpoints are not yet implemented in the backend
// export const permissionService = {
//   getAllPermissions: (params) =>
//     api.get('/api/permissions', { params }),
//   getPermissionById: (id) =>
//     api.get(`/api/permissions/${id}`),
//   createPermission: (permissionData) =>
//     api.post('/api/permissions', permissionData),
//   updatePermission: (id, permissionData) =>
//     api.put(`/api/permissions/${id}`, permissionData),
//   deletePermission: (id) =>
//     api.delete(`/api/permissions/${id}`)
// }
