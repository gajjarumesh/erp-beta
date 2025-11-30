'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => {
            const event = {
              target: { checked: !checked },
            } as React.ChangeEvent<HTMLInputElement>
            onChange?.(event)
          }}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-900',
            checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
            className
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <input
          type="checkbox"
          id={inputId}
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        {(label || description) && (
          <div className="grid gap-1 leading-none">
            {label && (
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
