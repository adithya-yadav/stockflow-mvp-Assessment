import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import * as authApi from '../api/auth'
import { AxiosError } from 'axios'

interface FormData {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(data: FormData) {
    try {
      const res = await authApi.login(data)
      login(res.data.token, res.data.user, res.data.organization)
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ error: string }>
      toast.error(error.response?.data?.error || 'Invalid email or password')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 60% 0%, #e0e7ff 0%, #f8fafc 55%, #f1f5f9 100%)',
      }}
    >
      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #c7d2fe 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          opacity: 0.35,
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">StockFlow</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-9">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to manage your inventory</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all duration-200"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 rounded-2xl text-sm font-bold tracking-wide disabled:opacity-60 transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-400">New to StockFlow?</span>
            </div>
          </div>

          <Link
            to="/signup"
            className="block w-full text-center py-3 rounded-2xl text-sm font-semibold text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
          >
            Create a free account
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Your data is secure and encrypted
        </p>
      </div>
    </div>
  )
}
