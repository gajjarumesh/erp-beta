'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[28rem]',
  xl: 'w-[32rem]',
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  size = 'md',
}: DrawerProps) {
  const isLeft = side === 'left'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: isLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 z-50 flex flex-col bg-white dark:bg-gray-800 shadow-2xl',
              sizeClasses[size],
              isLeft ? 'left-0' : 'right-0'
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
