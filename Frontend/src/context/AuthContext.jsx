import React, { createContext, useContext, useState, useEffect } from 'react'

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

  const login = (email, password, role = 'User') => {
    // Mock login - in production, this would call an API
    const userData = {
      id: 1,
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role,
      emailNotifications: true
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('budgetTrackerImportedData')
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
