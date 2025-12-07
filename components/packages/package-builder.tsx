'use client'

/**
 * Custom Package Builder Component
 * Allows users to build their custom SaaS package by selecting modules and adjusting limits
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Minus,
  Info,
} from 'lucide-react'
import { usePackageBuilderStore } from '@/lib/stores/package-builder-store'

interface PackageBuilderProps {
  onPriceCalculated?: (price: number) => void
  onPackageCreated?: (packageId: string) => void
  showCreateButton?: boolean
}

export function PackageBuilder({
  onPriceCalculated,
  onPackageCreated,
  showCreateButton = false,
}: PackageBuilderProps) {
  const {
    modules,
    limitTypes,
    isLoadingCatalog,
    selectedModuleIds,
    selectedSubModuleIds,
    limits,
    calculatedPrice,
    isCalculatingPrice,
    loadCatalog,
    toggleModule,
    toggleSubModule,
    updateLimit,
    calculatePrice,
    createPackage,
  } = usePackageBuilderStore()

  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [packageName, setPackageName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Load catalog on mount
  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  // Notify parent of price changes
  useEffect(() => {
    if (onPriceCalculated) {
      onPriceCalculated(calculatedPrice)
    }
  }, [calculatedPrice, onPriceCalculated])

  const toggleExpandModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleCreatePackage = async () => {
    if (!packageName.trim()) {
      // Use toast instead of alert
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: { type: 'error', message: 'Please enter a package name' }
        })
        window.dispatchEvent(event)
      }
      return
    }

    if (selectedModuleIds.length === 0) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: { type: 'error', message: 'Please select at least one module' }
        })
        window.dispatchEvent(event)
      }
      return
    }

    setIsCreating(true)
    try {
      const result = await createPackage(packageName, 'Custom package')
      if (onPackageCreated) {
        onPackageCreated(result.id)
      }
    } catch (error) {
      console.error('Failed to create package:', error)
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: { 
            type: 'error', 
            message: 'Failed to create package. Please try again.' 
          }
        })
        window.dispatchEvent(event)
      }
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoadingCatalog) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modules Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select Modules
        </h3>
        <div className="space-y-3">
          {modules.map((module) => {
            const isSelected = selectedModuleIds.includes(module.id)
            const isExpanded = expandedModules.includes(module.id)
            const hasSubModules = module.subModules && module.subModules.length > 0

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Module Header */}
                <div
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {module.name}
                          </h4>
                          {module.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {module.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            ₹{module.yearlyPrice.toLocaleString()}/yr
                          </span>
                          {hasSubModules && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpandModule(module.id)
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-modules */}
                <AnimatePresence>
                  {isExpanded && hasSubModules && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="p-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                          Optional Sub-modules
                        </p>
                        {module.subModules?.map((subModule) => {
                          const isSubSelected = selectedSubModuleIds.includes(subModule.id)
                          return (
                            <div
                              key={subModule.id}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                isSubSelected
                                  ? 'bg-blue-100 dark:bg-blue-900/30'
                                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750'
                              }`}
                              onClick={() => isSelected && toggleSubModule(subModule.id)}
                            >
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSubSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 dark:border-gray-600'
                                } ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isSubSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subModule.name}
                                </p>
                                {subModule.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {subModule.description}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                +₹{subModule.yearlyPrice.toLocaleString()}/yr
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Limits Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configure Limits
        </h3>
        <div className="space-y-4">
          {limitTypes.map((limitType) => {
            const currentLimit = limits.find((l) => l.limitTypeId === limitType.id)
            const limitValue = currentLimit?.limitValue || limitType.defaultLimit
            const extraUnits = Math.max(0, limitValue - limitType.defaultLimit)
            const extraCost = extraUnits * limitType.pricePerUnit

            return (
              <div
                key={limitType.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {limitType.name}
                      </h4>
                      {limitType.description && (
                        <div className="group relative">
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                            {limitType.description}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Default: {limitType.defaultLimit} {limitType.unit}
                      {extraCost > 0 && (
                        <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                          +₹{extraCost.toLocaleString()}/yr
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Limit Adjuster */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      updateLimit(
                        limitType.id,
                        Math.max(limitType.defaultLimit, limitValue - limitType.incrementStep)
                      )
                    }
                    disabled={limitValue <= limitType.defaultLimit}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        value={limitValue}
                        onChange={(e) =>
                          updateLimit(limitType.id, parseInt(e.target.value) || limitType.defaultLimit)
                        }
                        min={limitType.defaultLimit}
                        step={limitType.incrementStep}
                        className="w-24 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {limitType.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      updateLimit(limitType.id, limitValue + limitType.incrementStep)
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-6 -mx-6 -mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Yearly Cost</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {isCalculatingPrice ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  `₹${calculatedPrice.toLocaleString()}`
                )}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-400">/year</span>
            </div>
          </div>

          {showCreateButton && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Package name"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreatePackage}
                disabled={isCreating || selectedModuleIds.length === 0}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Package'
                )}
              </button>
            </div>
          )}
        </div>

        {selectedModuleIds.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Please select at least one module to see pricing
          </p>
        )}
      </div>
    </div>
  )
}
