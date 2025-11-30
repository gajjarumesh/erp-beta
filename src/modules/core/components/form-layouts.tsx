'use client'

import { cn } from '@/lib/utils'

interface FormLayoutProps {
  children: React.ReactNode
  className?: string
}

export function FormLayout({ children, className }: FormLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  )
}

interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface FormRowProps {
  children: React.ReactNode
  className?: string
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {children}
    </div>
  )
}

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface FormActionsProps {
  children: React.ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}
