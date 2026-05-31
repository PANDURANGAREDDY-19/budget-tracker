import api, { isApiOffline } from './api.js'
import { mockProjects } from '../data/mockData.js'

const OFFLINE_PROJECTS_KEY = 'budgetTrackerOfflineProjects'

const loadOfflineProjects = () => {
  if (typeof window === 'undefined') return [...mockProjects]
  try {
    const saved = JSON.parse(window.localStorage.getItem(OFFLINE_PROJECTS_KEY) || 'null')
    return Array.isArray(saved) && saved.length ? saved : [...mockProjects]
  } catch (error) {
    return [...mockProjects]
  }
}

const saveOfflineProjects = (projects) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OFFLINE_PROJECTS_KEY, JSON.stringify(projects))
  }
}

export const fetchProjects = async () => {
  if (isApiOffline()) return loadOfflineProjects()
  try {
    const { data } = await api.get('/projects')
    return data
  } catch (err) {
    return loadOfflineProjects()
  }
}

export const fetchProjectById = async (projectId) => {
  if (isApiOffline()) return loadOfflineProjects().find((project) => project.id === Number(projectId))
  try {
    const { data } = await api.get(`/projects/${projectId}`)
    return data
  } catch (err) {
    return loadOfflineProjects().find((project) => project.id === Number(projectId))
  }
}

export const createProject = async (project) => {
  if (isApiOffline()) {
    const projects = loadOfflineProjects()
    const id = Date.now()
    const saved = { id, ...project }
    const updated = [saved, ...projects]
    saveOfflineProjects(updated)
    return saved
  }

  try {
    const { data } = await api.post('/projects', project)
    return data
  } catch (err) {
    const projects = loadOfflineProjects()
    const id = Date.now()
    const saved = { id, ...project }
    const updated = [saved, ...projects]
    saveOfflineProjects(updated)
    return saved
  }
}

export const updateProject = async (projectId, updates) => {
  if (isApiOffline()) {
    const projects = loadOfflineProjects()
    const updatedProjects = projects.map((project) =>
      Number(project.id) === Number(projectId) ? { ...project, ...updates } : project
    )
    saveOfflineProjects(updatedProjects)
    return updatedProjects.find((project) => Number(project.id) === Number(projectId))
  }

  try {
    const { data } = await api.put(`/projects/${projectId}`, updates)
    return data
  } catch (err) {
    const projects = loadOfflineProjects()
    const updatedProjects = projects.map((project) =>
      Number(project.id) === Number(projectId) ? { ...project, ...updates } : project
    )
    saveOfflineProjects(updatedProjects)
    return updatedProjects.find((project) => Number(project.id) === Number(projectId))
  }
}
