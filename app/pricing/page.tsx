'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, ArrowRight, Check, Star } from 'lucide-react'
import { PackageBuilder } from '@/components/packages/package-builder'

export default function PricingPage() {
  const [calculatedPrice, setCalculatedPrice] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                NexusERP
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Build Your Perfect Package
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Pay Only for What You Need
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Select the modules you need, adjust your limits, and get a custom yearly
              price. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                title: 'Modular Pricing',
                description: 'Choose only the modules your business needs',
              },
              {
                title: 'Flexible Limits',
                description: 'Adjust users, storage, and transactions as you grow',
              },
              {
                title: 'Annual Billing',
                description: 'Simple yearly pricing with no surprise charges',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Package Builder Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Build Your Custom Package
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select modules and configure limits to see your personalized yearly price
              </p>
            </div>

            <PackageBuilder onPriceCalculated={setCalculatedPrice} />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Create your account and start building your custom ERP package today
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all shadow-lg text-lg"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-blue-200">
              No credit card required • 14-day free trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my package later?',
                a: 'Yes! You can upgrade or downgrade your package at any time. When you downgrade, your data is safely locked (not deleted) and can be restored when you upgrade again.',
              },
              {
                q: 'What happens if I exceed my limits?',
                a: "You'll receive notifications when approaching your limits. You can upgrade your limits at any time to continue uninterrupted service.",
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use zero-access encryption for sensitive data. Even our super admins cannot decrypt your legal and payment information.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards and UPI through Razorpay. All payments are secure and PCI-compliant.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                NexusERP
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
              <Link href="/support" className="hover:text-gray-900 dark:hover:text-white">
                Support
              </Link>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
                Privacy
              </Link>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
                Terms
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-4">
            © 2024 NexusERP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
