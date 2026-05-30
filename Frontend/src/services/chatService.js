import { chatHistory } from '../data/mockData.js'

export const fetchChatHistory = async () => {
  return Promise.resolve(chatHistory)
}

export const postChatMessage = async (message) => {
  const response = {
    id: chatHistory.length + 1,
    sender: 'ai',
    message: `Assistant reply to: ${message}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return Promise.resolve(response)
}
