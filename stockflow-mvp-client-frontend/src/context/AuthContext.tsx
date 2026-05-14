import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Organization } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  organization: Organization | null
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User, organization: Organization) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const organization = localStorage.getItem('organization')
    return {
      token,
      user: user ? JSON.parse(user) : null,
      organization: organization ? JSON.parse(organization) : null,
    }
  })

  function login(token: string, user: User, organization: Organization) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('organization', JSON.stringify(organization))
    setState({ token, user, organization })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    setState({ token: null, user: null, organization: null })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
