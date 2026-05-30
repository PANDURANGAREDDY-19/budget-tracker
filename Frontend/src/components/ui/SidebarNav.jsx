import { NavLink } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  PieChart,
  MapPin,
  MessageSquare,
  FileText,
  Users,
  BellRing,
  ShieldCheck
} from 'lucide-react'

const menu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { label: 'Analytics', icon: PieChart, path: '/app/analytics' },
  { label: 'Project Tracking', icon: FileText, path: '/app/projects' },
  { label: 'Map View', icon: MapPin, path: '/app/map' },
  { label: 'Report Center', icon: MessageSquare, path: '/app/report' },
  { label: 'Chatbot', icon: MessageSquare, path: '/app/chat' },
  { label: 'Notifications', icon: BellRing, path: '/app/notifications' },
  { label: 'Admin', icon: ShieldCheck, path: '/app/admin' }
]

const SidebarNav = () => {
  return (
    <aside className="hidden w-80 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900">CivicTrack</h2>
        <p className="mt-2 text-sm text-slate-500">Public Project Transparency & Tracking</p>
      </div>
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-civic-600 text-white shadow-soft' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default SidebarNav
