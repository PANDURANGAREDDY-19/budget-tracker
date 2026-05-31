import React, { useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext'
import { Bell, Trash2 } from 'lucide-react'

const NotificationsPage = () => {
  const { notifications, markAsRead, clearNotifications, addNotification } = useNotifications()

  // Add sample notifications on first load if none exist
  useEffect(() => {
    if (notifications.length === 0) {
      addNotification('Budget', 'Budget revision approved for Riverfront Park', 'The revised budget has been successfully approved.', 'admin@civictrack.gov')
      addNotification('Report', 'New citizen report submitted for Eastside School', 'A new report has been submitted regarding the Eastside School project.', 'admin@civictrack.gov')
      addNotification('Project', 'Transit expansion schedule update', 'The transit expansion project schedule has been updated.', 'admin@civictrack.gov')
      addNotification('Verification', 'Verification completed for Downtown Health Hub', 'The verification process for Downtown Health Hub is complete.', 'admin@civictrack.gov')
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-2">Stay current with recent project updates and citizen reports.</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No notifications yet</p>
          <p className="text-slate-500 text-sm">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              onClick={() => markAsRead(note.id)}
              className={`rounded-lg border p-4 cursor-pointer transition ${
                note.read
                  ? 'border-slate-200 bg-white hover:bg-slate-50'
                  : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 ${
                  note.read ? 'bg-slate-300' : 'bg-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {note.type}
                        </span>
                        <p className="font-semibold text-slate-900">{note.title}</p>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{note.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        📧 {note.email} • {note.timestamp}
                      </p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 text-lg">×</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
