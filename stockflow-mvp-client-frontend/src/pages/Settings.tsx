import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getSettings, updateSettings } from '../api/settings'
import { Settings2, AlertTriangle } from 'lucide-react'

interface FormData {
  defaultLowStockThreshold: number
}

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    getSettings()
      .then((res) => reset({ defaultLowStockThreshold: res.data.defaultLowStockThreshold }))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [reset])

  async function onSubmit(data: FormData) {
    try {
      await updateSettings(Number(data.defaultLowStockThreshold))
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Settings2 size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your organization preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-800">Inventory Alerts</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Configure when products are flagged as low stock</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-48" />
              <div className="h-10 bg-slate-100 rounded-xl w-48" />
              <div className="h-3 bg-slate-100 rounded w-72" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Default Low Stock Threshold
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    {...register('defaultLowStockThreshold', {
                      required: 'Required',
                      min: { value: 0, message: 'Must be 0 or more' },
                    })}
                    className="w-32 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="text-sm text-slate-500">units</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Products with quantity at or below this value are flagged as low stock.<br />
                  Products with a custom threshold will use their own value instead.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Changing this threshold will immediately affect which products appear in the low stock dashboard section.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Saving…' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
