import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Projects', icon: '🏗️', path: '/projects' },
    { label: 'Analytics', icon: '📈', path: '/analytics' },
    { label: 'Admin', icon: '⚙️', path: '/admin' }
  ]

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
      <div className="p-8">
        <h2 className="text-lg font-bold tracking-wide text-gray-300 uppercase">Menu</h2>
      </div>
      <nav className="space-y-2 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-5 py-4 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold text-gray-200 hover:text-white group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-100">Need help?</p>
          <button className="text-white text-sm font-semibold mt-2 hover:underline">Contact Support</button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
