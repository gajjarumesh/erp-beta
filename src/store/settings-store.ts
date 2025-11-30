'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
type NumberFormat = 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR'

interface SettingsState {
  // Display settings
  dateFormat: DateFormat
  numberFormat: NumberFormat
  language: string
  timezone: string
  
  // Default values
  defaultCurrency: string
  defaultTaxRate: number
  defaultPaymentTermDays: number
  
  // Feature flags
  features: {
    multiCompany: boolean
    multiCurrency: boolean
    inventory: boolean
    manufacturing: boolean
    pos: boolean
    ecommerce: boolean
  }
  
  // Actions
  setDateFormat: (format: DateFormat) => void
  setNumberFormat: (format: NumberFormat) => void
  setLanguage: (language: string) => void
  setTimezone: (timezone: string) => void
  setDefaultCurrency: (currency: string) => void
  setDefaultTaxRate: (rate: number) => void
  setDefaultPaymentTermDays: (days: number) => void
  setFeature: (feature: keyof SettingsState['features'], enabled: boolean) => void
  resetSettings: () => void
}

const defaultSettings = {
  dateFormat: 'MM/DD/YYYY' as DateFormat,
  numberFormat: 'en-US' as NumberFormat,
  language: 'en',
  timezone: 'UTC',
  defaultCurrency: 'USD',
  defaultTaxRate: 0,
  defaultPaymentTermDays: 30,
  features: {
    multiCompany: true,
    multiCurrency: true,
    inventory: true,
    manufacturing: false,
    pos: false,
    ecommerce: false,
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setDateFormat: (dateFormat) => set({ dateFormat }),
      setNumberFormat: (numberFormat) => set({ numberFormat }),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
      setDefaultCurrency: (defaultCurrency) => set({ defaultCurrency }),
      setDefaultTaxRate: (defaultTaxRate) => set({ defaultTaxRate }),
      setDefaultPaymentTermDays: (defaultPaymentTermDays) => set({ defaultPaymentTermDays }),
      setFeature: (feature, enabled) => set((state) => ({
        features: { ...state.features, [feature]: enabled },
      })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
    }
  )
)
