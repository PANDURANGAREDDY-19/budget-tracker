import React, { useState, useRef, useEffect } from 'react'
import ProjectTable from '../components/ProjectTable'
import { fetchProjects, createProject, updateProject } from '../services/projectsService.js'
import { fetchDepartmentExpense } from '../services/analyticsService.js'
import { useBudgetContext } from '../context/BudgetContext'

const initialProjectState = {
  name: '',
  department: 'Infrastructure',
  location: '',
  budget: 0,
  spent: 0,
  progress: 0,
  status: 'Planning',
  verified: false,
  description: '',
  timeline: '',
  category: 'Public Works'
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [statusMessage, setStatusMessage] = useState('')
  const [projects, setProjects] = useState([])
  const [departmentExpenses, setDepartmentExpenses] = useState([])
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState(initialProjectState)
  const fileInputRef = useRef(null)
  const { importBudgetData } = useBudgetContext()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [projectData, deptData] = await Promise.all([fetchProjects(), fetchDepartmentExpense()])
        if (mounted) {
          setProjects(projectData)
          setDepartmentExpenses(deptData)
        }
      } catch (err) {
        console.warn('Unable to load admin dashboard data', err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleExport = () => {
    const exportData = {
      projects,
      departmentExpenses,
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'budget-tracker-data.json'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    setStatusMessage('Data exported successfully.')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedData = JSON.parse(text)
      
      // Import data using context (immediately updates Analytics)
      const success = importBudgetData(importedData)
      
      if (success) {
        // Also save to localStorage for persistence
        window.localStorage.setItem('budgetTrackerImportedData', JSON.stringify(importedData))
        setStatusMessage('✓ Data imported successfully! Check Analytics page to view imported budget data.')
      } else {
        setStatusMessage('Import failed: invalid data format.')
      }
    } catch (error) {
      setStatusMessage('Import failed: invalid JSON file.')
    } finally {
      event.target.value = ''
    }
  }

  const handleAddProjectClick = () => {
    setShowAddProjectForm(true)
    setStatusMessage('')
  }

  const resetProjectForm = () => {
    setEditingProject(null)
    setNewProject(initialProjectState)
  }

  const handleNewProjectChange = (field, value) => {
    setNewProject((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowAddProjectForm(true)
    setNewProject({
      name: project.name || '',
      department: project.department || 'Infrastructure',
      location: project.location || '',
      budget: project.budget || 0,
      spent: project.spent || 0,
      progress: project.progress ?? project.completion ?? 0,
      status: project.status || 'Planning',
      verified: project.verified || false,
      description: project.description || '',
      timeline: project.timeline || '',
      category: project.category || 'Public Works'
    })
  }

  const handleAddProjectSubmit = (event) => {
    event.preventDefault()
    const payload = {
      name: newProject.name,
      department: newProject.department,
      location: newProject.location,
      district: newProject.location,
      budget: Number(newProject.budget),
      spent: Number(newProject.spent),
      progress: Number(newProject.progress),
      status: newProject.status,
      description: newProject.description,
      category: newProject.category
    }

    setStatusMessage('Saving project...')

    const saveAction = editingProject
      ? updateProject(editingProject.id, payload)
      : createProject(payload)

    saveAction
      .then((saved) => {
        setProjects((prev) => {
          if (editingProject) {
            return prev.map((project) => (project.id === saved.id ? saved : project))
          }
          return [saved, ...prev]
        })
        setShowAddProjectForm(false)
        resetProjectForm()
        setStatusMessage(editingProject ? 'Project updated successfully.' : 'Project added successfully.')
      })
      .catch((err) => {
        console.error('Failed to save project', err)
        setStatusMessage('Failed to save project. Check admin token and backend.')
      })
  }

  const handleCancelAddProject = () => {
    setShowAddProjectForm(false)
    resetProjectForm()
    setStatusMessage('')
  }

  const handleClearCache = async () => {
    window.localStorage.clear()
    window.sessionStorage.clear()

    if (window.caches) {
      const cacheNames = await window.caches.keys()
      await Promise.all(cacheNames.map((name) => window.caches.delete(name)))
    }

    setStatusMessage('Cache cleared successfully.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage projects, budgets, and system settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['projects', 'budgets', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projects Management</h2>
              <p className="text-sm text-slate-600">Manage project records and create new entries.</p>
            </div>
            <button onClick={handleAddProjectClick} className="btn btn-primary">+ Add Project</button>
          </div>
          {showAddProjectForm && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h3>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAddProjectSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => handleNewProjectChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={newProject.department}
                    onChange={(e) => handleNewProjectChange('department', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => handleNewProjectChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
                  <input
                    type="text"
                    value={newProject.timeline}
                    onChange={(e) => handleNewProjectChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => handleNewProjectChange('budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Spent</label>
                  <input
                    type="number"
                    value={newProject.spent}
                    onChange={(e) => handleNewProjectChange('spent', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => handleNewProjectChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    value={newProject.progress}
                    onChange={(e) => handleNewProjectChange('progress', e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => handleNewProjectChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleCancelAddProject}
                    className="px-5 py-3 rounded-lg border border-gray-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {editingProject ? 'Update Project' : 'Save Project'}
                  </button>
                </div>
              </form>
            </div>
          )}
          <ProjectTable projects={projects} onEdit={handleEditProject} />
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Budget Allocation</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Department</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Allocated</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Spent</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Remaining</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentExpenses.length > 0 ? (
                    departmentExpenses.map((dept) => (
                      <tr key={dept.name} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{dept.name}</td>
                        <td className="px-4 py-3 text-gray-900">${(dept.allocated / 1000000).toFixed(1)}M</td>
                        <td className="px-4 py-3 text-gray-900">${(dept.spent / 1000000).toFixed(1)}M</td>
                        <td className="px-4 py-3 text-gray-900">${((dept.allocated - dept.spent) / 1000000).toFixed(1)}M</td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:underline">View</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Loading budget details...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">System Name</label>
                  <input
                    type="text"
                    defaultValue="Public Budget Tracker"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Notifications</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span className="ml-2">Enable email notifications</span>
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Export Data
                </button>
                <button
                  onClick={handleImportClick}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Import Data
                </button>
                <button
                  onClick={handleClearCache}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear Cache
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {statusMessage && (
                  <p className="text-sm text-slate-600 mt-3">{statusMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
