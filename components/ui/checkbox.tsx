'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            className={cn(
              'peer h-5 w-5 shrink-0 rounded border border-gray-300 bg-white ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-blue-600 checked:border-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:bg-blue-600',
              className
            )}
            ref={ref}
            {...props}
          />
          <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
        </div>
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
Checkbox.displayName = 'Checkbox'

export { Checkbox }
