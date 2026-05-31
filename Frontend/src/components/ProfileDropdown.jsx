import React, { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const handleSettings = () => {
    navigate('/app/settings')
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 hover:bg-slate-100 transition"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
          {user?.name?.charAt(0) || 'A'}
        </span>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200">
            <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-600">{user?.email || 'user@example.com'}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.role || 'User'}</p>
          </div>

          <div className="py-2">
            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition"
            >
              <Settings className="h-4 w-4" />
              Settings & Preferences
            </button>
            <button
              onClick={() => {
                navigate('/app/notifications')
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition"
            >
              <Mail className="h-4 w-4" />
              Notifications
            </button>
          </div>

          <div className="border-t border-slate-200 p-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
