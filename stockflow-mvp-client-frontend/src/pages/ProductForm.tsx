import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createProduct, getProducts, updateProduct } from '../api/products'
import { AxiosError } from 'axios'
import { ArrowLeft, Package } from 'lucide-react'

interface FormData {
  name: string
  sku: string
  description: string
  quantity: number
  costPrice: string
  sellingPrice: string
  lowStockThreshold: string
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (!isEdit) return
    getProducts().then((res) => {
      const product = res.data.find((p) => p.id === id)
      if (product) {
        reset({
          name: product.name,
          sku: product.sku,
          description: product.description ?? '',
          quantity: product.quantity,
          costPrice: product.costPrice?.toString() ?? '',
          sellingPrice: product.sellingPrice?.toString() ?? '',
          lowStockThreshold: product.lowStockThreshold?.toString() ?? '',
        })
      }
    })
  }, [id, isEdit, reset])

  async function onSubmit(data: FormData) {
    const payload = {
      name: data.name,
      sku: data.sku,
      description: data.description || null,
      quantity: Number(data.quantity),
      costPrice: data.costPrice ? Number(data.costPrice) : null,
      sellingPrice: data.sellingPrice ? Number(data.sellingPrice) : null,
      lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : null,
    }
    try {
      if (isEdit && id) {
        await updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      navigate('/products')
    } catch (err) {
      const error = err as AxiosError<{ error: string }>
      toast.error(error.response?.data?.error || 'Something went wrong')
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Products
      </button>

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
          <Package size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEdit ? 'Update product details' : 'Fill in the details to add a new product'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Basic Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name <span className="text-red-400">*</span></label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={inputClass}
                  placeholder="Widget A"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass}>SKU <span className="text-red-400">*</span></label>
                <input
                  {...register('sku', { required: 'SKU is required' })}
                  className={inputClass}
                  placeholder="WGT-001"
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1.5">{errors.sku.message}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Description <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                placeholder="Brief description of this product…"
              />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Inventory */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Inventory</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Quantity on Hand <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  min="0"
                  {...register('quantity', { required: 'Quantity is required', min: { value: 0, message: 'Must be 0 or more' } })}
                  className={inputClass}
                  placeholder="0"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1.5">{errors.quantity.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Low Stock Threshold</label>
                <input
                  type="number"
                  min="0"
                  {...register('lowStockThreshold')}
                  className={inputClass}
                  placeholder="Leave blank for default"
                />
                <p className="text-xs text-slate-400 mt-1.5">Uses global default if blank</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Pricing (Optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cost Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('costPrice')}
                    className={`${inputClass} pl-7`}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Selling Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('sellingPrice')}
                    className={`${inputClass} pl-7`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
