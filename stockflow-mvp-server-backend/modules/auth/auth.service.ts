import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'
import { SignupInput, LoginInput, AuthResponse } from './auth.types'

function signToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
  const { email, password, organizationName } = input

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw { status: 409, message: 'Email already registered' }

  const hashed = await bcrypt.hash(password, 10)

  const org = await prisma.organization.create({ data: { name: organizationName } })
  const user = await prisma.user.create({
    data: { email, password: hashed, organizationId: org.id },
  })

  return {
    token: signToken(user.id),
    user: { id: user.id, email: user.email },
    organization: { id: org.id, name: org.name },
  }
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { email, password } = input

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  })
  if (!user) throw { status: 401, message: 'Invalid credentials' }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw { status: 401, message: 'Invalid credentials' }

  return {
    token: signToken(user.id),
    user: { id: user.id, email: user.email },
    organization: { id: user.organization.id, name: user.organization.name },
  }
}
