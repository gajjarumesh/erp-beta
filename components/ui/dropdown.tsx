'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined)

function useDropdown() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown provider')
  }
  return context
}

interface DropdownProps {
  children: React.ReactNode
  className?: string
}

export function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode
  className?: string
  showChevron?: boolean
}

export function DropdownTrigger({ children, className, showChevron = true }: DropdownTriggerProps) {
  const { open, setOpen } = useDropdown()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
        className
      )}
    >
      {children}
      {showChevron && (
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
      )}
    </button>
  )
}

interface DropdownContentProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right'
}

export function DropdownContent({ children, className, align = 'right' }: DropdownContentProps) {
  const { open } = useDropdown()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 mt-2 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800',
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'danger'
}

export function DropdownItem({
  children,
  className,
  onClick,
  disabled,
  variant = 'default',
}: DropdownItemProps) {
  const { setOpen } = useDropdown()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    setOpen(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
        variant === 'default' && 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
        variant === 'danger' && 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

interface DropdownSeparatorProps {
  className?: string
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return (
    <div className={cn('my-1 border-t border-gray-200 dark:border-gray-700', className)} />
  )
}
