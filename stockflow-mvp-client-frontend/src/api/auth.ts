import api from './axios'
import type { AuthResponse } from '../types'

export const signup = (data: { email: string; password: string; organizationName: string }) =>
  api.post<AuthResponse>('/auth/signup', data)

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data)
