import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const ADMIN_EMAIL = 'admin@civictrack.gov'
  const ADMIN_PASSWORD = 'CivicTrack123!'
  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'CivicTrack123!'

  const login = (email, password) => {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials')
    }

    const userData = {
      id: 1,
      email,
      name: 'Civic Admin',
      role: 'Admin',
      emailNotifications: true
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    api.defaults.headers.common['X-Admin-Token'] = ADMIN_TOKEN
    return true
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('budgetTrackerImportedData')
    delete api.defaults.headers.common['X-Admin-Token']
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateEmailNotifications = (enabled) => {
    if (user) {
      const updatedUser = { ...user, emailNotifications: enabled }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateEmailNotifications
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
