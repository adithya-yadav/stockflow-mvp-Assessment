import api from './axios'
import type { Product } from '../types'

export const getProducts = () => api.get<Product[]>('/products')

export const createProduct = (data: Partial<Product>) => api.post<Product>('/products', data)

export const updateProduct = (id: string, data: Partial<Product>) =>
  api.put<Product>(`/products/${id}`, data)

export const deleteProduct = (id: string) => api.delete(`/products/${id}`)
