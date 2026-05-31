import React, { useEffect, useState } from 'react'
import { fetchReportCategories, submitReport } from '../services/reportsService.js'
import { reportCategories as fallbackCategories } from '../data/mockData.js'

const ReportPage = () => {
  const [formState, setFormState] = useState({ category: fallbackCategories[0], description: '' })
  const [categories, setCategories] = useState(fallbackCategories)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchReportCategories()
        if (mounted && Array.isArray(data) && data.length > 0) {
          setCategories(data)
          setFormState((s) => ({ ...s, category: data[0] }))
        }
      } catch (err) {
        console.warn('Could not load report categories', err)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await submitReport(formState)
      setMessage({ text: 'Report submitted successfully!', type: 'success' })
      setFormState({ category: categories[0] || fallbackCategories[0], description: '' })
      setTimeout(() => setMessage({ text: '', type: '' }), 4000)
    } catch (err) {
      console.error('Report submission failed', err)
      setMessage({ text: 'Report submission failed', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Report Center</h1>
        <p className="text-slate-600 mt-2">Submit project concerns, budget feedback, or verification requests.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
              value={formState.category}
              onChange={(event) => setFormState({ ...formState, category: event.target.value })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              rows="6"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
              value={formState.description}
              onChange={(event) => setFormState({ ...formState, description: event.target.value })}
              placeholder="Describe the issue in detail"
            />
          </div>

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-civic-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-civic-500/20 hover:bg-civic-700 transition">
            Submit Report
          </button>
        </form>
        {message.text && (
          <p className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}

export default ReportPage
