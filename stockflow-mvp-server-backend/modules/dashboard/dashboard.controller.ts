import { Request, Response } from 'express'
import * as dashboardService from './dashboard.service'

export async function getDashboard(req: Request, res: Response) {
  try {
    const data = await dashboardService.getDashboard(req.user!.organizationId)
    res.json(data)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}
