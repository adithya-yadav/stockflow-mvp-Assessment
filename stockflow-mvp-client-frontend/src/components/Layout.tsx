import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Settings, LogOut, TrendingUp, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  const { organization, user, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = organization?.name?.slice(0, 2).toUpperCase() ?? 'SF'

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">StockFlow</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-none truncate max-w-35">
                {organization?.name ?? 'My Organization'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-indigo-600' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-indigo-600">{initials}</span>
            </div>
            <p className="text-xs text-slate-600 truncate flex-1">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut size={17} className="text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-200 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">StockFlow</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-none truncate max-w-35">
                {organization?.name ?? 'My Organization'}
              </p>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={() => setDrawerOpen(false)}>
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-indigo-600' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-indigo-600">{initials}</span>
            </div>
            <p className="text-xs text-slate-600 truncate flex-1">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut size={17} className="text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <TrendingUp size={13} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-sm">StockFlow</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-600">{initials}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
