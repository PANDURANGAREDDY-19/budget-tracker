import React from 'react'
import { mockProjects } from '../data/mockData.js'

const MapViewPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Map View</h1>
        <p className="text-slate-600 mt-2">Visualize public projects across the city and inspect active zones.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="h-[560px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <div className="mb-4 text-4xl">🗺️</div>
            <p className="text-lg font-semibold">Interactive Map Placeholder</p>
            <p className="mt-3 text-center text-sm text-slate-500">Replace this placeholder with a map integration such as Mapbox or Leaflet.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Key Projects</h2>
            <div className="mt-4 space-y-3">
              {mockProjects.slice(0, 5).map((project) => (
                <div key={project.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{project.name}</p>
                      <p className="text-sm text-slate-500">{project.location}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Map Filters</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>• Show verified projects</p>
              <p>• Display delayed zones</p>
              <p>• Filter by department or status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapViewPage
