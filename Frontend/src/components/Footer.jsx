import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <p className="font-semibold text-white mb-2">About</p>
            <p className="text-sm text-gray-400">Transparent civic budget tracking and project accountability</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Quick Links</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
              <br/>
              <a href="#" className="hover:text-blue-400 transition-colors">API Reference</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Legal</p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <br/>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 Public Budget Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
