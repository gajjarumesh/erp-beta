export const featureFlags = {
  // Core features
  multiCompany: true,
  multiCurrency: true,
  darkMode: true,
  notifications: true,
  
  // Module features
  modules: {
    dashboard: true,
    crm: true,
    sales: true,
    inventory: true,
    purchase: true,
    accounting: true,
    expenses: true,
    hr: true,
    payroll: true,
    projects: true,
    website: true,
    reports: true,
    settings: true,
  },
  
  // Advanced features
  advancedReporting: false,
  aiAssistant: false,
  automations: false,
  customFields: false,
  apiAccess: true,
  webhooks: false,
  sso: false,
  
  // Development/Beta features
  betaFeatures: false,
  debugMode: process.env.NODE_ENV === 'development',
}

export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature] === true
}

export function isModuleEnabled(module: keyof typeof featureFlags.modules): boolean {
  return featureFlags.modules[module] === true
}

export default featureFlags
