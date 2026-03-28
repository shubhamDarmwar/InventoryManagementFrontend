import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (data) => {
    const { token, user } = data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    try {
      const decoded = jwtDecode(token)
      console.log('Token decoded:', decoded)
    } catch (err) {
      console.error('Error decoding token:', err)
    }

    set({
      token,
      user,
      isAuthenticated: true
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
  },

  setUser: (user) => set({ user }),

  getToken: () => localStorage.getItem('token'),

  initializeAuth: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        const decoded = jwtDecode(token)
        const isExpired = decoded.exp < Date.now() / 1000
        
        if (isExpired) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          set({
            user: null,
            token: null,
            isAuthenticated: false
          })
        } else {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true
          })
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
}))
