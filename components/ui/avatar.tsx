'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromString(str: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-rose-500 to-rose-600',
  ]
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [error, setError] = React.useState(false)
  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?'
  const gradientColor = getColorFromString(fallback || alt || 'default')

  if (src && !error) {
    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium text-white bg-gradient-to-br',
        sizeClasses[size],
        gradientColor,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}
