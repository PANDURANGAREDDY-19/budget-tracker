import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { fetchProjects } from '../services/projectsService.js'

const districtCoordinates = {
  'West District': [40.7128, -74.006],
  'River District': [40.7282, -73.7949],
  'East District': [40.7128, -73.9352],
  'North District': [40.7831, -73.9712],
  'Central District': [40.758, -73.9855],
  'South District': [40.706, -73.940],
  'Eastside': [40.7306, -73.9352],
  'Downtown': [40.706, -74.009],
  'Uptown': [40.787, -73.975],
  'Harbor District': [40.700, -74.012]
}

const defaultCoordinates = [40.73061, -73.935242]

const markerIcon = new Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const getProjectCoordinates = (project) => {
  const name = project.location || project.district || project.name || ''
  return districtCoordinates[name] || defaultCoordinates
}

const MapViewPage = () => {
  const [projects, setProjects] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('All')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchProjects()
        if (mounted) setProjects(data)
      } catch (err) {
        console.warn('Failed to load projects for map view', err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedStatus === 'All') return projects
    return projects.filter((project) => project.status === selectedStatus)
  }, [projects, selectedStatus])

  const center = useMemo(() => {
    if (filteredProjects.length > 0) {
      return getProjectCoordinates(filteredProjects[0])
    }
    return defaultCoordinates
  }, [filteredProjects])

  const statusOptions = ['All', 'Planning', 'In Progress', 'Completed', 'Delayed']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Map View</h1>
        <p className="text-slate-600 mt-2">Visualize public projects across the city and explore budget zones.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <MapContainer center={center} zoom={11} scrollWheelZoom className="h-[620px] rounded-3xl">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredProjects.map((project) => {
              const position = getProjectCoordinates(project)
              return (
                <Marker key={project.id} position={position} icon={markerIcon}>
                  <Popup>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900">{project.name}</p>
                      <p className="text-sm text-slate-600">{project.department || project.category || project.location}</p>
                      <p className="text-sm text-slate-600">Status: {project.status || 'Unknown'}</p>
                      <p className="text-sm text-slate-600">Budget: ${project.budget?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Map Filters</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Projects on map</p>
                <p className="text-5xl font-bold text-slate-900 mt-2">{filteredProjects.length}</p>
                <p className="text-sm text-slate-600 mt-2">Showing results from the live project database.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Featured zones</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {filteredProjects.slice(0, 5).map((project) => (
                    <li key={project.id} className="rounded-2xl bg-white p-3 border border-slate-200">
                      <p className="font-semibold text-slate-900">{project.name}</p>
                      <p>{project.location || project.district || 'Unknown neighborhood'}</p>
                      <p className="text-xs text-slate-500">Status: {project.status || 'Unknown'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapViewPage
