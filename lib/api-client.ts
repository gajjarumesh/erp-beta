/**
 * API Client Configuration for NestJS Backend
 * 
 * This file provides a centralized API client for communicating
 * with the NestJS backend from the Next.js frontend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    signup: (data: {
      email: string;
      password: string;
      displayName: string;
      tenantId: string;
    }) => this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    login: (data: { email: string; password: string }) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    refresh: (refreshToken: string) =>
      this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    logout: () => this.request('/auth/logout', { method: 'POST' }),

    me: () => this.request('/auth/me'),
  };

  // Tenant endpoints
  tenants = {
    onboard: (data: {
      name: string;
      slug: string;
      adminEmail: string;
      adminName: string;
      adminPassword: string;
      plan?: string;
      logoUrl?: string;
      primaryColor?: string;
      locale?: string;
      timezone?: string;
    }) =>
      this.request('/tenants/onboard', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    get: (id: string) => this.request(`/tenants/${id}`),

    update: (id: string, data: any) =>
      this.request(`/tenants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    activate: (id: string) =>
      this.request(`/tenants/${id}/activate`, { method: 'PUT' }),

    suspend: (id: string) =>
      this.request(`/tenants/${id}/suspend`, { method: 'PUT' }),
  };

  // User endpoints
  users = {
    list: () => this.request('/users'),

    get: (id: string) => this.request(`/users/${id}`),

    create: (data: {
      email: string;
      displayName: string;
      password: string;
      isActive?: boolean;
      roleIds?: string[];
    }) =>
      this.request('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request(`/users/${id}`, { method: 'DELETE' }),
  };

  // Settings endpoints
  settings = {
    get: (scope: 'tenant' | 'module' | 'user' = 'tenant') =>
      this.request(`/settings?scope=${scope}`),

    update: (data: {
      scope: 'tenant' | 'module' | 'user';
      key: string;
      value: any;
    }) =>
      this.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Audit log endpoints
  auditLogs = {
    list: (filters?: {
      action?: string;
      objectType?: string;
      actorUserId?: string;
    }) => {
      const params = new URLSearchParams();
      if (filters?.action) params.append('action', filters.action);
      if (filters?.objectType) params.append('objectType', filters.objectType);
      if (filters?.actorUserId) params.append('actorUserId', filters.actorUserId);
      
      const query = params.toString();
      return this.request(`/audit-logs${query ? `?${query}` : ''}`);
    },
  };

  // Package endpoints (Phase 7/8)
  packages = {
    // Catalog endpoints
    getModulesCatalog: () => this.request('/packages/catalog/modules'),
    getLimitTypesCatalog: () => this.request('/packages/catalog/limits'),
    
    // Pricing calculator
    calculatePrice: (data: {
      moduleIds: string[];
      subModuleIds?: string[];
      limits: Array<{ limitTypeId: string; limitValue: number }>;
    }) => this.request('/packages/calculate-price', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    // Custom package management
    createCustomPackage: (data: {
      name: string;
      description?: string;
      modules: Array<{ moduleId: string }>;
      subModules?: Array<{ subModuleId: string }>;
      limits: Array<{ limitTypeId: string; limitValue: number }>;
    }) => this.request('/packages/custom', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    getCustomPackages: () => this.request('/packages/custom'),
    
    getCustomPackageById: (id: string) => this.request(`/packages/custom/${id}`),
    
    activatePackage: (id: string) => 
      this.request(`/packages/custom/${id}/activate`, { method: 'PUT' }),
    
    upgradePackage: (currentId: string, newPackageId: string) =>
      this.request(`/packages/custom/${currentId}/upgrade`, {
        method: 'PUT',
        body: JSON.stringify({ newPackageId }),
      }),
    
    getPackageLimits: (id: string) => this.request(`/packages/custom/${id}/limits`),
  };
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
