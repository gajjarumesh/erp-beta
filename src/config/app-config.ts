export const appConfig = {
  name: 'NexusERP',
  description: 'Modern Enterprise Resource Planning',
  version: '1.0.0',
  company: {
    name: 'NexusERP Inc.',
    website: 'https://nexuserp.com',
    support: 'support@nexuserp.com',
  },
  defaults: {
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    pageSize: 25,
    maxPageSize: 100,
  },
  auth: {
    sessionDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    passwordMinLength: 8,
    requireEmailVerification: false,
  },
  api: {
    baseUrl: '/api',
    timeout: 30000,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

export default appConfig
