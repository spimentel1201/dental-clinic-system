'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'admin' | 'odontologo' | 'especialista'

export interface AuthUser {
  id: string
  email: string
  nombres: string
  apellidos: string
  role: UserRole
  especialidad?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuarios de prueba hardcodeados
const TEST_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@clinicadental.com': {
    password: 'Admin123!',
    user: {
      id: 'U-001',
      email: 'admin@clinicadental.com',
      nombres: 'Valeria',
      apellidos: 'Salas',
      role: 'odontologo', // Admin con rol de odontólogo
      especialidad: 'General',
    },
  },
  'especialista@clinicadental.com': {
    password: 'Especialista123!',
    user: {
      id: 'U-002',
      email: 'especialista@clinicadental.com',
      nombres: 'Carlos',
      apellidos: 'Mendoza',
      role: 'especialista',
      especialidad: 'Ortodoncista',
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const testUser = TEST_USERS[email]

      if (!testUser) {
        throw new Error('Usuario no encontrado')
      }

      if (testUser.password !== password) {
        throw new Error('Contraseña incorrecta')
      }

      // Login successful
      setUser(testUser.user)
      localStorage.setItem('auth_user', JSON.stringify(testUser.user))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
