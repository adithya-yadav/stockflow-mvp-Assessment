import prisma from '../../lib/prisma'
import { CreateProductInput, UpdateProductInput } from './product.types'

export function findAllByOrg(organizationId: string) {
  return prisma.product.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  })
}

export function findById(id: string) {
  return prisma.product.findUnique({ where: { id } })
}

export function findByOrgAndSku(organizationId: string, sku: string) {
  return prisma.product.findUnique({
    where: { organizationId_sku: { organizationId, sku } },
  })
}

export function create(data: CreateProductInput) {
  return prisma.product.create({ data })
}

export function update(id: string, data: UpdateProductInput) {
  return prisma.product.update({ where: { id }, data })
}

export function remove(id: string) {
  return prisma.product.delete({ where: { id } })
}
