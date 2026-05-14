import prisma from '../../lib/prisma'
import { SettingsResponse, UpdateSettingsInput } from './settings.types'

export async function getSettings(organizationId: string): Promise<SettingsResponse> {
  const org = await prisma.organization.findUnique({ where: { id: organizationId } })
  if (!org) throw { status: 404, message: 'Organization not found' }
  return { defaultLowStockThreshold: org.defaultLowStockThreshold }
}

export async function updateSettings(
  organizationId: string,
  input: UpdateSettingsInput
): Promise<SettingsResponse> {
  const { defaultLowStockThreshold } = input
  if (!Number.isInteger(defaultLowStockThreshold) || defaultLowStockThreshold < 0) {
    throw { status: 400, message: 'defaultLowStockThreshold must be a non-negative integer' }
  }
  const org = await prisma.organization.update({
    where: { id: organizationId },
    data: { defaultLowStockThreshold },
  })
  return { defaultLowStockThreshold: org.defaultLowStockThreshold }
}
