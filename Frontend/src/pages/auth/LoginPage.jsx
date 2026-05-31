import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    try {
      login(email, password)
      navigate('/app/dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Sign in to CivicTrack</h1>
        <p className="mt-2 text-slate-600">Access public project tracking and budget transparency tools.</p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-civic-600 px-6 py-3 text-white text-base font-semibold hover:bg-civic-700 transition"
        >
          Sign In
        </button>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link to="/auth/forgot-password" className="hover:text-civic-700">Forgot password?</Link>
          <Link to="/auth/register" className="text-civic-600 hover:text-civic-700">Create account</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
