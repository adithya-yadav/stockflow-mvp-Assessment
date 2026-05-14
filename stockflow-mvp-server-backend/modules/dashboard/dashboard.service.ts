import prisma from '../../lib/prisma'
import { DashboardResponse } from './dashboard.types'

export async function getDashboard(organizationId: string): Promise<DashboardResponse> {
  const org = await prisma.organization.findUnique({ where: { id: organizationId } })
  if (!org) throw { status: 404, message: 'Organization not found' }

  const products = await prisma.product.findMany({ where: { organizationId } })

  const totalProducts = products.length
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockItems = products.filter(
    (p) => p.quantity <= (p.lowStockThreshold ?? org.defaultLowStockThreshold)
  )

  return { totalProducts, totalQuantity, lowStockItems }
}
