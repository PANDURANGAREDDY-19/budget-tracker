import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-slate-600">Enter your email to receive password reset instructions.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input type="email" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-500" placeholder="you@example.com" />
        </div>

        <button className="w-full rounded-full bg-civic-600 px-6 py-3 text-white text-base font-semibold hover:bg-civic-700 transition">
          Send Reset Link
        </button>

        <p className="text-center text-sm text-slate-500">
          Remembered your password? <Link to="/auth/login" className="text-civic-600 hover:text-civic-700">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
