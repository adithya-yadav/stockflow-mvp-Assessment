import { Request, Response } from 'express'
import * as productService from './product.service'

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await productService.getAll(req.user!.organizationId)
    res.json(products)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

export async function createProduct(req: Request, res: Response) {
  const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body
  try {
    const product = await productService.create(
      {
        name,
        sku,
        description: description || null,
        quantity: Number(quantity),
        costPrice: costPrice ? Number(costPrice) : null,
        sellingPrice: sellingPrice ? Number(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
      },
      req.user!.organizationId
    )
    res.status(201).json(product)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = req.params['id'] as string
  const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body
  try {
    const updated = await productService.update(id, req.user!.organizationId, {
      ...(name !== undefined && { name }),
      ...(sku !== undefined && { sku }),
      ...(description !== undefined && { description: description || null }),
      ...(quantity !== undefined && { quantity: Number(quantity) }),
      ...(costPrice !== undefined && { costPrice: costPrice ? Number(costPrice) : null }),
      ...(sellingPrice !== undefined && { sellingPrice: sellingPrice ? Number(sellingPrice) : null }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null }),
    })
    res.json(updated)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = req.params['id'] as string
  try {
    await productService.remove(id, req.user!.organizationId)
    res.json({ success: true })
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}
