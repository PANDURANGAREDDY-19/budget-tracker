import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-700 text-lg">📊</div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Budget Tracker</h1>
          </div>
          <div className="flex items-center gap-8">
            <input
              type="text"
              placeholder="Search projects, departments..."
              className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all w-64 text-gray-700 placeholder-gray-500"
            />
            <button className="relative hover:bg-blue-700 p-2.5 rounded-lg transition-colors">
              <span className="text-2xl">🔔</span>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                3
              </span>
            </button>
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl font-bold text-white hover:bg-blue-300 cursor-pointer transition-colors">M</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
