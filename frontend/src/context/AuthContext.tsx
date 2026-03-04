import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/services/api'

interface AuthContextType {
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  // Keep localStorage in sync with token state
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password, name: '' })
    const newToken = response.data.access_token
    // Save to localStorage immediately to avoid race conditions
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const register = async (email: string, password: string, name: string) => {
    await api.post('/api/auth/register', { email, password, name })
    // Auto-login after registration
    await login(email, password)
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}