import api, { isApiOffline } from './api.js'
import { chatHistory } from '../data/mockData.js'

export const fetchChatHistory = async () => {
  if (isApiOffline()) return chatHistory
  try {
    const { data } = await api.get('/chat/history')
    return data
  } catch (err) {
    return chatHistory
  }
}

export const postChatMessage = async (message) => {
  if (isApiOffline()) {
    return { id: Date.now(), user: false, message: 'Chat is currently offline. Your message has been stored locally.', timestamp: new Date().toLocaleTimeString() }
  }

  const { data } = await api.post('/chat/messages', { message })
  return data
}
