import React from 'react'
import { notifications } from '../data/mockData.js'

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600 mt-2">Stay current with recent project updates and citizen reports.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div key={note.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{note.title}</p>
                <p className="text-sm text-slate-600">{note.description}</p>
              </div>
              <span className="text-sm text-slate-500">{note.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPage
