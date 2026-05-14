export interface SignupInput {
  email: string
  password: string
  organizationName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: { id: string; email: string }
  organization: { id: string; name: string }
}
