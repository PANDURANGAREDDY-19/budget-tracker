import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchNotifications } from '../services/reportsService.js'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [emailNotificationSettings, setEmailNotificationSettings] = useState({
    budgetAlerts: true,
    projectUpdates: true,
    verificationRequests: true,
    citizenReports: true,
    weeklyDigest: true
  })

  // Load settings from localStorage
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('emailNotificationSettings')
    if (savedSettings) {
      try {
        setEmailNotificationSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  // Load initial notifications from backend on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchNotifications()
        if (mounted) setNotifications(data)
      } catch (err) {
        console.warn('Unable to load notifications from API, using local state')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const addNotification = useCallback((type, title, message, email) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      email,
      timestamp: new Date().toLocaleString(),
      read: false
    }
    setNotifications((prev) => [notification, ...prev])
    return notification
  }, [])

  const updateEmailNotificationSettings = (key, value) => {
    const updatedSettings = { ...emailNotificationSettings, [key]: value }
    setEmailNotificationSettings(updatedSettings)
    localStorage.setItem('emailNotificationSettings', JSON.stringify(updatedSettings))
  }

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = {
    notifications,
    emailNotificationSettings,
    addNotification,
    updateEmailNotificationSettings,
    markAsRead,
    clearNotifications,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
