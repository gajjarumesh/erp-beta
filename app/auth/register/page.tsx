'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { PackageBuilder } from '@/components/packages/package-builder'
import { usePackageBuilderStore } from '@/lib/stores/package-builder-store'
import { apiClient } from '@/lib/api-client'

type AccountType = 'individual' | 'company'

export default function RegisterPage() {
  const router = useRouter()
  const { isLoading: authLoading, error: authError, clearError } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType>('individual')
  const [packageId, setPackageId] = useState<string | null>(null)
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [localError, setLocalError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    terms: false,
  })

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError('')
    setStep(2)
  }

  const handleStep2Submit = () => {
    setStep(3)
  }

  const handleStep3Submit = async () => {
    clearError()
    setLocalError('')

    try {
      // Step 1: Create tenant
      // Generate slug from company name or user name
      const slugSource = formData.company || formData.name || 'user'
      const tenantSlug = slugSource
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `user-${Date.now()}`

      const tenantResponse = await apiClient.tenants.onboard({
        name: formData.company || formData.name,
        slug: tenantSlug,
        adminEmail: formData.email,
        adminName: formData.name,
        adminPassword: formData.password, // Backend will hash this over HTTPS
      })

      if (!tenantResponse.data) {
        throw new Error('Failed to create tenant')
      }

      const tenantId = tenantResponse.data.tenant.id

      // Step 2: Create package if one was built
      if (packageId) {
        // Activate the package (would normally redirect to payment)
        await apiClient.packages.activatePackage(packageId)
      }

      setStep(4) // Show success/payment step
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      )
    }
  }

  const handlePackageCreated = (id: string) => {
    setPackageId(id)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl py-8"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Building2 className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">NexusERP</span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8 max-w-2xl">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Type' },
              { num: 3, label: 'Package' },
              { num: 4, label: 'Confirm' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.num ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </div>
                {index < 3 && (
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2">
                    <div
                      className={`h-full bg-blue-600 transition-all ${
                        step > s.num ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {(authError || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 max-w-2xl"
            >
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {localError || authError}
              </p>
            </motion.div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {step === 1 && 'Create your account'}
            {step === 2 && 'Choose account type'}
            {step === 3 && 'Build your package'}
            {step === 4 && 'Review & Confirm'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {step === 1 && 'Start your 14-day free trial. No credit card required.'}
            {step === 2 && 'Select the account type that best fits your needs.'}
            {step === 3 && 'Customize your package with the modules you need.'}
            {step === 4 && 'Review your selections and complete registration.'}
          </p>

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          )}

          {/* Step 2: Account Type Selection */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    accountType === 'individual'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="accountType"
                      value="individual"
                      checked={accountType === 'individual'}
                      onChange={(e) => setAccountType(e.target.value as AccountType)}
                      className="w-5 h-5 mt-1 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          Individual
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        For personal use or freelancers. Instant activation after payment.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    accountType === 'company'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="accountType"
                      value="company"
                      checked={accountType === 'company'}
                      onChange={(e) => setAccountType(e.target.value as AccountType)}
                      className="w-5 h-5 mt-1 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          Company
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        For businesses and organizations. Requires verification before
                        activation.
                      </p>
                      {accountType === 'company' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            required={accountType === 'company'}
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({ ...formData, company: e.target.value })
                            }
                            placeholder="Acme Inc"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={accountType === 'company' && !formData.company}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Package Builder */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <PackageBuilder
                  onPriceCalculated={setCalculatedPrice}
                  onPackageCreated={handlePackageCreated}
                  showCreateButton={false}
                />
              </div>

              <div className="flex gap-4 max-w-2xl">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep3Submit}
                  disabled={authLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2 max-w-2xl">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {accountType === 'company'
                  ? 'Registration Submitted!'
                  : 'Account Created Successfully!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {accountType === 'company' ? (
                  <>
                    Your company registration is pending verification. You'll receive an email
                    once your account is activated. This typically takes 1-2 business days.
                  </>
                ) : (
                  <>
                    Your account has been created. You can now sign in and start using
                    NexusERP.
                  </>
                )}
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                Go to Sign In
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-blue-700 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-white max-w-lg"
        >
          <h2 className="text-3xl font-bold mb-6">Everything you need to run your business</h2>
          <ul className="space-y-4">
            {[
              'Choose only the modules you need',
              'Pay yearly with transparent pricing',
              'Scale seamlessly as you grow',
              '14-day free trial on all plans',
              'World-class support team',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
