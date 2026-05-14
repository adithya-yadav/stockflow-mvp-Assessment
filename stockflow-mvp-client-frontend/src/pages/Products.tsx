import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProducts, deleteProduct } from '../api/products'
import { getSettings } from '../api/settings'
import type { Product } from '../types'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [defaultThreshold, setDefaultThreshold] = useState(5)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProducts(), getSettings()])
      .then(([prodRes, settingsRes]) => {
        setProducts(prodRes.data)
        setDefaultThreshold(settingsRes.data.defaultLowStockThreshold)
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockCount = products.filter(
    (p) => p.quantity <= (p.lowStockThreshold ?? defaultThreshold)
  ).length

  function isLowStock(p: Product) {
    return p.quantity <= (p.lowStockThreshold ?? defaultThreshold)
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteProduct(deleteId)
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? '…' : `${products.length} products`}
            {!loading && lowStockCount > 0 && (
              <span className="ml-2 text-amber-600 font-medium">· {lowStockCount} low stock</span>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-24" />
                </div>
                <div className="h-3.5 bg-slate-100 rounded w-16" />
                <div className="h-3.5 bg-slate-100 rounded w-20" />
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Package size={26} className="text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {search ? 'No products found' : 'No products yet'}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {search ? 'Try a different search term' : 'Add your first product to get started'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/products/new')}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
              >
                <Plus size={14} /> Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Selling Price</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const low = isLowStock(p)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={14} className="text-indigo-400" />
                          </div>
                          <span className="font-semibold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{p.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-base ${low ? 'text-red-600' : 'text-slate-800'}`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {p.sellingPrice != null ? (
                          <span className="font-medium">₹{p.sellingPrice.toFixed(2)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {low ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                            <AlertTriangle size={11} />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/products/${p.id}/edit`)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
