// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter types
export interface FilterParams {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: string | string[] | number | boolean | undefined
}

// Common entity types
export interface AuditFields {
  createdAt: string
  updatedAt: string
  createdById?: string
  updatedById?: string
}

export interface BaseEntity extends AuditFields {
  id: string
}

export interface CompanyScoped extends BaseEntity {
  companyId: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, string[]>
  }
}

// Form types
export interface FormFieldError {
  field: string
  message: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Table types
export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface TableAction<T> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?: 'default' | 'danger'
  show?: (row: T) => boolean
}

// Status types
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default'

export interface StatusConfig {
  label: string
  color: StatusType
  icon?: React.ReactNode
}

// User & Auth types
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER'

export interface Permission {
  module: string
  actions: {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
}

// Currency types
export interface Currency {
  code: string
  name: string
  symbol: string
  rate?: number
}

// Address type
export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}
