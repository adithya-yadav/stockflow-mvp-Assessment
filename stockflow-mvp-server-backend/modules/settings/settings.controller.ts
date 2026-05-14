import { Request, Response } from 'express'
import * as settingsService from './settings.service'

export async function getSettings(req: Request, res: Response) {
  try {
    const data = await settingsService.getSettings(req.user!.organizationId)
    res.json(data)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}

export async function updateSettings(req: Request, res: Response) {
  const { defaultLowStockThreshold } = req.body
  try {
    const data = await settingsService.updateSettings(req.user!.organizationId, {
      defaultLowStockThreshold: Number(defaultLowStockThreshold),
    })
    res.json(data)
  } catch (err: any) {
    res.status(err.status ?? 500).json({ error: err.message })
  }
}
