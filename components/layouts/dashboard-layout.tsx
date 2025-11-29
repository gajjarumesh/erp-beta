'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// useLayoutEffect runs synchronously after DOM mutations but before paint (client-only).
// useEffect can cause flicker as it runs after paint. On server, we use useEffect as useLayoutEffect warns.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setMounted(true)
    // Check if on mobile
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show a loading skeleton during SSR/hydration to prevent layout shifts
  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
