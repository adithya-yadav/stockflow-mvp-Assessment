export interface CreateProductInput {
  name: string
  sku: string
  description?: string | null
  quantity: number
  costPrice?: number | null
  sellingPrice?: number | null
  lowStockThreshold?: number | null
  organizationId: string
}

export interface UpdateProductInput {
  name?: string
  sku?: string
  description?: string | null
  quantity?: number
  costPrice?: number | null
  sellingPrice?: number | null
  lowStockThreshold?: number | null
}
