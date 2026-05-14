import { useEffect, useState } from 'react'
import { Package, Boxes, AlertTriangle, TrendingUp } from 'lucide-react'
import { getDashboard } from '../api/dashboard'
import type { DashboardData } from '../types'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { organization } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    {
      label: 'Total Products',
      value: data?.totalProducts ?? 0,
      icon: Package,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      change: 'All tracked products',
    },
    {
      label: 'Units in Stock',
      value: data?.totalQuantity ?? 0,
      icon: Boxes,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: 'Total quantity on hand',
    },
    {
      label: 'Low Stock Alerts',
      value: data?.lowStockItems.length ?? 0,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: 'Need restocking',
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-indigo-500" />
          <p className="text-sm text-indigo-600 font-medium">{organization?.name}</p>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your inventory status</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, change }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={iconColor} />
              </div>
            </div>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-16 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-28" />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{change}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Low stock table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-800">Low Stock Items</h2>
            {data && data.lowStockItems.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {data.lowStockItems.length}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            View all products →
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-slate-100 rounded flex-1" />
                <div className="h-4 bg-slate-100 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : data?.lowStockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
              <Boxes size={22} className="text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">All products well stocked</p>
            <p className="text-xs text-slate-400 mt-1">No low stock alerts at this time</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty on Hand</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Threshold</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4 font-bold text-red-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{item.lowStockThreshold ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
