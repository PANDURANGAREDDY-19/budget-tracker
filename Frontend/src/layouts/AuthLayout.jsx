import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-50 via-white to-civic-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
