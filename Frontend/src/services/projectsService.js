import api from './api.js'

export const fetchProjects = async () => {
  const { data } = await api.get('/projects')
  return data
}

export const fetchProjectById = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}`)
  return data
}

export const createProject = async (project) => {
  const { data } = await api.post('/projects', project)
  return data
}

export const updateProject = async (projectId, updates) => {
  const { data } = await api.put(`/projects/${projectId}`, updates)
  return data
}
