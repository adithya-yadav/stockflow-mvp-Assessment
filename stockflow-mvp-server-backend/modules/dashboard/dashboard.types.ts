import { Product } from '@prisma/client'

export interface DashboardResponse {
  totalProducts: number
  totalQuantity: number
  lowStockItems: Product[]
}
