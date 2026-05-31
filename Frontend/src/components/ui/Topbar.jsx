import { Bell, MessageCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext.jsx'
import ProfileDropdown from '../ProfileDropdown'

const Topbar = () => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-2 flex items-center gap-2 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, reports, budgets"
              className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app/chat" className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">
            <MessageCircle className="h-5 w-5 text-slate-700" />
          </Link>
          {user ? (
            <>
              <Link to="/app/notifications" className="relative p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">
                <Bell className="h-5 w-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>
              <ProfileDropdown />
            </>
          ) : (
            <Link
              to="/auth/login"
              className="rounded-full bg-civic-600 px-5 py-3 text-sm font-semibold text-white hover:bg-civic-700 transition"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
