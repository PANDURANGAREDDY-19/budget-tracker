import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-50 via-white to-civic-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full bg-civic-100 px-4 py-1 text-sm font-semibold text-civic-700">CivicTrack Platform</p>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Public project transparency built for citizens.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Track budgets, verify progress, and stay informed about public infrastructure projects from planning to completion.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-civic-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-civic-500/20 transition hover:bg-civic-700"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Transparent Budgets', description: 'Open access to project budgets and spending reports.' },
            { title: 'Verified Progress', description: 'Track real-time progress and verification status.' },
            { title: 'Citizen Engagement', description: 'Submit reports and get updates on project decisions.' }
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-3 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
