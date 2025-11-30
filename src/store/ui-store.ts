'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

// Generate a UUID-compatible string that works in all environments
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  link?: string
  createdAt: string
}

interface Toast {
  id: string
  title: string
  message?: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: Theme
  notifications: Notification[]
  toasts: Toast[]
  globalSearchOpen: boolean
  commandPaletteOpen: boolean
  
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: Theme) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  addToast: (toast: Omit<Toast, 'id'>) => Toast
  removeToast: (id: string) => void
  setGlobalSearchOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'system',
      notifications: [],
      toasts: [],
      globalSearchOpen: false,
      commandPaletteOpen: false,

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),

      addNotification: (notification) => {
        const id = generateId()
        const newNotification: Notification = {
          ...notification,
          id,
          isRead: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      })),

      clearNotifications: () => set({ notifications: [] }),

      addToast: (toast) => {
        const id = generateId()
        const newToast: Toast = { ...toast, id }
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }))
        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, toast.duration ?? 5000)
        }
        return newToast
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

      setGlobalSearchOpen: (globalSearchOpen) => set({ globalSearchOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
)
