'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2 } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const { user, accessToken } = useAuthStore()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!accessToken || !user) {
      router.push('/auth/login?redirect=/dashboard')
    } else {
      // Redirect to helpdesk if authenticated
      router.push('/dashboard')
    }
  }, [accessToken, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting to support...</p>
      </div>
    </div>
  )
}
