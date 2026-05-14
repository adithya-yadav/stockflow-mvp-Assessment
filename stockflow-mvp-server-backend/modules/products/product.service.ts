import * as productModel from './product.model'
import { CreateProductInput, UpdateProductInput } from './product.types'

export async function getAll(organizationId: string) {
  return productModel.findAllByOrg(organizationId)
}

export async function create(input: Omit<CreateProductInput, 'organizationId'>, organizationId: string) {
  const { name, sku, quantity, costPrice, sellingPrice, lowStockThreshold } = input

  if (!name || !sku || quantity === undefined) {
    throw { status: 400, message: 'Name, SKU, and quantity are required' }
  }

  const duplicate = await productModel.findByOrgAndSku(organizationId, sku)
  if (duplicate) throw { status: 409, message: 'SKU already exists in your organization' }

  return productModel.create({ name, sku, quantity, costPrice, sellingPrice, lowStockThreshold, organizationId })
}

export async function update(id: string, organizationId: string, data: UpdateProductInput) {
  const product = await productModel.findById(id)
  if (!product || product.organizationId !== organizationId) {
    throw { status: 404, message: 'Product not found' }
  }
  return productModel.update(id, data)
}

export async function remove(id: string, organizationId: string) {
  const product = await productModel.findById(id)
  if (!product || product.organizationId !== organizationId) {
    throw { status: 404, message: 'Product not found' }
  }
  await productModel.remove(id)
}
