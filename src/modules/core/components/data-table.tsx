'use client'

import { useState, useMemo } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  width?: string
  className?: string
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField?: keyof T
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  sortable?: boolean
  defaultSortKey?: string
  defaultSortOrder?: 'asc' | 'desc'
  onSort?: (key: string, order: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  pagination,
  sortable = false,
  defaultSortKey,
  defaultSortOrder = 'asc',
  onSort,
  onRowClick,
  actions,
  emptyMessage = 'No data found',
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState(defaultSortKey || '')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder)

  const handleSort = (key: string) => {
    if (!sortable) return
    
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(newOrder)
    onSort?.(key, newOrder)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  // Client-side sorting if no onSort handler
  const sortedData = useMemo(() => {
    if (!sortKey || onSort) return data
    
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      const comparison = aVal < bVal ? -1 : 1
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [data, sortKey, sortOrder, onSort])

  // Client-side search if no onSearch handler
  const filteredData = useMemo(() => {
    if (!searchQuery || onSearch) return sortedData
    
    const query = searchQuery.toLowerCase()
    return sortedData.filter((row) =>
      columns.some((col) => {
        const value = row[col.key]
        return String(value).toLowerCase().includes(query)
      })
    )
  }, [sortedData, searchQuery, columns, onSearch])

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white',
                    column.width && `w-[${column.width}]`,
                    column.sortable !== false && sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700',
                    column.className
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable !== false && sortable && (
                      <span className="text-gray-400">
                        {sortKey === column.key ? (
                          sortOrder === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={String(row[keyField])}
                  className={cn(
                    'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-gray-900 dark:text-white',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
