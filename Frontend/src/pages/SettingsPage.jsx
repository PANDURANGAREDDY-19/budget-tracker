import React, { useState } from 'react'
import { Mail, Bell, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

const SettingsPage = () => {
  const { user, updateEmailNotifications } = useAuth()
  const { emailNotificationSettings, updateEmailNotificationSettings } = useNotifications()
  const [successMessage, setSuccessMessage] = useState('')

  const handleNotificationToggle = (key) => {
    updateEmailNotificationSettings(key, !emailNotificationSettings[key])
    setSuccessMessage(`✓ ${key.replace(/([A-Z])/g, ' $1')} updated successfully`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleEmailNotificationsToggle = () => {
    updateEmailNotifications(!user?.emailNotifications)
    setSuccessMessage('✓ Email notifications ' + (user?.emailNotifications ? 'disabled' : 'enabled'))
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings & Preferences</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and notification preferences.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Account Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>

          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={user?.role || 'User'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Email Notification Preferences */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
        </div>

        {/* Master Toggle */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Enable Email Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">Receive all email notifications to your inbox</p>
            </div>
            <button
              onClick={handleEmailNotificationsToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                user?.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  user?.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Individual Notification Types */}
        {user?.emailNotifications && (
          <div className="space-y-4">
            {[
              { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Get notified about budget changes and alerts' },
              { key: 'projectUpdates', label: 'Project Updates', description: 'Receive updates on project progress' },
              { key: 'verificationRequests', label: 'Verification Requests', description: 'Get notified about verification tasks' },
              { key: 'citizenReports', label: 'Citizen Reports', description: 'Receive new citizen report submissions' },
              { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of all activities' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(item.key)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    emailNotificationSettings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      emailNotificationSettings[item.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {!user?.emailNotifications && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">Email notifications are disabled. Enable them above to customize notification types.</p>
          </div>
        )}
      </div>

      {/* Notification Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notification Schedule</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time for Weekly Digest</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="09:00">9:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Days to Receive Notifications</label>
            <div className="grid grid-cols-2 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
