import api from './api.js'

export const fetchChatHistory = async () => {
  const { data } = await api.get('/chat/history')
  return data
}

export const postChatMessage = async (message) => {
  const { data } = await api.post('/chat/messages', { message })
  return data
}
