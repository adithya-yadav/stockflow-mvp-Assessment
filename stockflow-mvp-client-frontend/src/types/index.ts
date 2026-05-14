export interface User {
  id: string
  email: string
}

export interface Organization {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  sku: string
  description?: string | null
  quantity: number
  costPrice?: number | null
  sellingPrice?: number | null
  lowStockThreshold?: number | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  totalProducts: number
  totalQuantity: number
  lowStockItems: Product[]
}

export interface AuthResponse {
  token: string
  user: User
  organization: Organization
}
