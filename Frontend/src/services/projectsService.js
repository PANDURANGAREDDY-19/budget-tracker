import { mockProjects } from '../data/mockData.js'

export const fetchProjects = async () => {
  return Promise.resolve(mockProjects)
}

export const fetchProjectById = async (projectId) => {
  const project = mockProjects.find((project) => project.id === Number(projectId))
  return Promise.resolve(project || null)
}
