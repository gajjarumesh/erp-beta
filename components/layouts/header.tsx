'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, User, Grid3X3, LogOut, Settings, Building2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { MobileMenuButton } from './sidebar'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAppSwitcher, setShowAppSwitcher] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onMenuClick} />
        <div className="hidden md:block w-80">
          <Input
            placeholder="Search..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* App Switcher */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAppSwitcher(!showAppSwitcher)
              setShowNotifications(false)
              setShowUserMenu(false)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Grid3X3 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </motion.button>

          <AnimatePresence>
            {showAppSwitcher && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Access</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/"
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Home</span>
                  </Link>
                  <Link
                    href="/app-store"
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Grid3X3 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Apps</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Settings</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowAppSwitcher(false)
              setShowUserMenu(false)
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        New order received
                      </p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Payment confirmed
                      </p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/settings"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowAppSwitcher(false)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">john@company.com</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
