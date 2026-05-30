import React, { useState } from 'react'
import { chatHistory as initialHistory } from '../data/mockData.js'

const ChatbotPage = () => {
  const [messages, setMessages] = useState(initialHistory)
  const [input, setInput] = useState('')

  const handleSend = (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: messages.length + 1, sender: 'user', message: input.trim(), timestamp: 'Now' }
    setMessages((prev) => [...prev, userMessage, { id: prev.length + 2, sender: 'ai', message: 'Thanks for your question. We are reviewing the latest project data.', timestamp: 'Now' }])
    setInput('')
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

        <form onSubmit={handleSend} className="mt-6 flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
            placeholder="Ask Civic Assistant a question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="rounded-2xl bg-civic-600 px-6 py-3 text-white transition hover:bg-civic-700">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatbotPage
