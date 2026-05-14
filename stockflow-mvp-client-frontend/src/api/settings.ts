import api from './axios'

export const getSettings = () => api.get<{ defaultLowStockThreshold: number }>('/settings')

export const updateSettings = (defaultLowStockThreshold: number) =>
  api.put<{ defaultLowStockThreshold: number }>('/settings', { defaultLowStockThreshold })
