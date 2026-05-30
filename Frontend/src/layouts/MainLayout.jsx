import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SidebarNav from '../components/ui/SidebarNav.jsx'
import Topbar from '../components/ui/Topbar.jsx'

const MainLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-6 lg:px-8 bg-surface">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
