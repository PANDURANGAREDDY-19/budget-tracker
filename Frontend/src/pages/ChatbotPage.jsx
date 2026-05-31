import React, { useEffect, useState } from 'react'
import { fetchChatHistory, postChatMessage } from '../services/chatService.js'

const ChatbotPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory()
        setMessages(history)
      } catch (err) {
        setError('Unable to load chat history. Please ensure the backend is running.')
      }
    }

    loadHistory()
  }, [])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!input.trim() || isSending) return

    setError('')
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const assistantResponse = await postChatMessage(userMessage.message)
      setMessages((prev) => [...prev, assistantResponse])
    } catch (err) {
      setError('Unable to send message. Please try again.')
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          message: 'I could not respond at the moment. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Civic Assistant</h1>
        <p className="text-slate-600 mt-2">Ask about project status, budget allocations, or public reports.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4 max-h-[520px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-3xl px-5 py-4 ${message.sender === 'user' ? 'bg-civic-50 self-end text-slate-900' : 'bg-slate-100 text-slate-800'}`}
            >
              <p className="text-sm font-semibold mb-2">{message.sender === 'user' ? 'You' : 'Civic Assistant'}</p>
              <p>{message.message}</p>
              <p className="mt-2 text-xs text-slate-500">{message.timestamp}</p>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <form onSubmit={handleSend} className="mt-6 flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
            placeholder="Ask Civic Assistant a question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending}
            className={`rounded-2xl px-6 py-3 text-white transition ${isSending ? 'bg-slate-400' : 'bg-civic-600 hover:bg-civic-700'}`}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatbotPage
