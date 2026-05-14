import { Request, Response } from 'express'
import * as authService from './auth.service'

export async function signup(req: Request, res: Response) {
  const { email, password, organizationName } = req.body
  if (!email || !password || !organizationName) {
    res.status(400).json({ error: 'All fields are required' })
    return
  }
  try {
    const result = await authService.signup({ email, password, organizationName })
    res.status(201).json(result)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }
  try {
    const result = await authService.login({ email, password })
    res.status(200).json(result)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}
