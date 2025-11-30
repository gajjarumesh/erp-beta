'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER'
  companyId: string | null
  avatar: string | null
}

export interface Company {
  id: string
  name: string
  slug: string
  logo: string | null
  currency: string
  timezone: string
}

interface AuthState {
  user: User | null
  company: Company | null
  companies: Company[]
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setUser: (user: User | null) => void
  setCompany: (company: Company | null) => void
  setCompanies: (companies: Company[]) => void
  setToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  login: (user: User, token: string, company: Company, companies: Company[]) => void
  logout: () => void
  switchCompany: (companyId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      companies: [],
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setCompany: (company) => set({ company }),
      setCompanies: (companies) => set({ companies }),
      setToken: (token) => set({ token }),
      setIsLoading: (isLoading) => set({ isLoading }),

      login: (user, token, company, companies) => set({
        user,
        token,
        company,
        companies,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        token: null,
        company: null,
        companies: [],
        isAuthenticated: false,
        isLoading: false,
      }),

      switchCompany: (companyId) => {
        const { companies } = get()
        const company = companies.find(c => c.id === companyId)
        if (company) {
          set({ company })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        company: state.company,
        companies: state.companies,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
