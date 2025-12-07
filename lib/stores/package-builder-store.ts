/**
 * Package Builder Store (Zustand)
 * Manages custom package building state and real-time pricing
 */

import { create } from 'zustand';
import { apiClient } from '../api-client';

interface Module {
  id: string;
  slug: string;
  name: string;
  description?: string;
  yearlyPrice: number;
  icon?: string;
  color?: string;
  subModules?: SubModule[];
}

interface SubModule {
  id: string;
  moduleId: string;
  slug: string;
  name: string;
  description?: string;
  yearlyPrice: number;
}

interface LimitType {
  id: string;
  slug: string;
  type: string;
  name: string;
  description?: string;
  unit: string;
  defaultLimit: number;
  pricePerUnit: number;
  incrementStep: number;
}

interface PackageLimit {
  limitTypeId: string;
  limitValue: number;
}

interface PackageBuilderState {
  // Catalog data
  modules: Module[];
  limitTypes: LimitType[];
  isLoadingCatalog: boolean;
  
  // Selected package configuration
  selectedModuleIds: string[];
  selectedSubModuleIds: string[];
  limits: PackageLimit[];
  
  // Pricing
  calculatedPrice: number;
  isCalculatingPrice: boolean;
  
  // Actions
  loadCatalog: () => Promise<void>;
  toggleModule: (moduleId: string) => void;
  toggleSubModule: (subModuleId: string) => void;
  updateLimit: (limitTypeId: string, value: number) => void;
  calculatePrice: () => Promise<void>;
  resetBuilder: () => void;
  
  // Package creation
  createPackage: (name: string, description?: string) => Promise<{ id: string }>;
}

export const usePackageBuilderStore = create<PackageBuilderState>((set, get) => ({
  // Initial state
  modules: [],
  limitTypes: [],
  isLoadingCatalog: false,
  selectedModuleIds: [],
  selectedSubModuleIds: [],
  limits: [],
  calculatedPrice: 0,
  isCalculatingPrice: false,

  loadCatalog: async () => {
    set({ isLoadingCatalog: true });
    try {
      const [modulesResponse, limitsResponse] = await Promise.all([
        apiClient.packages.getModulesCatalog(),
        apiClient.packages.getLimitTypesCatalog(),
      ]);
      
      const modules = modulesResponse.data || [];
      const limitTypes = limitsResponse.data || [];
      
      // Initialize limits with default values
      const initialLimits = limitTypes.map((lt: LimitType) => ({
        limitTypeId: lt.id,
        limitValue: lt.defaultLimit,
      }));
      
      set({
        modules,
        limitTypes,
        limits: initialLimits,
        isLoadingCatalog: false,
      });
    } catch (error) {
      console.error('Failed to load catalog:', error);
      set({ isLoadingCatalog: false });
    }
  },

  toggleModule: (moduleId: string) => {
    const { selectedModuleIds, selectedSubModuleIds, modules } = get();
    
    const isSelected = selectedModuleIds.includes(moduleId);
    
    if (isSelected) {
      // Remove module and its sub-modules
      const module = modules.find((m) => m.id === moduleId);
      const subModuleIds = module?.subModules?.map((sm) => sm.id) || [];
      
      set({
        selectedModuleIds: selectedModuleIds.filter((id) => id !== moduleId),
        selectedSubModuleIds: selectedSubModuleIds.filter(
          (id) => !subModuleIds.includes(id)
        ),
      });
    } else {
      // Add module
      set({
        selectedModuleIds: [...selectedModuleIds, moduleId],
      });
    }
    
    // Recalculate price
    get().calculatePrice();
  },

  toggleSubModule: (subModuleId: string) => {
    const { selectedSubModuleIds } = get();
    
    const isSelected = selectedSubModuleIds.includes(subModuleId);
    
    if (isSelected) {
      set({
        selectedSubModuleIds: selectedSubModuleIds.filter((id) => id !== subModuleId),
      });
    } else {
      set({
        selectedSubModuleIds: [...selectedSubModuleIds, subModuleId],
      });
    }
    
    // Recalculate price
    get().calculatePrice();
  },

  updateLimit: (limitTypeId: string, value: number) => {
    const { limits } = get();
    
    const updatedLimits = limits.map((limit) =>
      limit.limitTypeId === limitTypeId
        ? { ...limit, limitValue: value }
        : limit
    );
    
    set({ limits: updatedLimits });
    
    // Recalculate price
    get().calculatePrice();
  },

  calculatePrice: async () => {
    const { selectedModuleIds, selectedSubModuleIds, limits } = get();
    
    // Skip if no modules selected
    if (selectedModuleIds.length === 0) {
      set({ calculatedPrice: 0 });
      return;
    }
    
    set({ isCalculatingPrice: true });
    
    try {
      const response = await apiClient.packages.calculatePrice({
        moduleIds: selectedModuleIds,
        subModuleIds: selectedSubModuleIds,
        limits,
      });
      
      if (response.data) {
        set({
          calculatedPrice: response.data.totalYearlyPrice || 0,
          isCalculatingPrice: false,
        });
      }
    } catch (error) {
      console.error('Failed to calculate price:', error);
      set({ isCalculatingPrice: false });
    }
  },

  resetBuilder: () => {
    const { limitTypes } = get();
    
    const initialLimits = limitTypes.map((lt) => ({
      limitTypeId: lt.id,
      limitValue: lt.defaultLimit,
    }));
    
    set({
      selectedModuleIds: [],
      selectedSubModuleIds: [],
      limits: initialLimits,
      calculatedPrice: 0,
    });
  },

  createPackage: async (name: string, description?: string) => {
    const { selectedModuleIds, selectedSubModuleIds, limits } = get();
    
    const response = await apiClient.packages.createCustomPackage({
      name,
      description,
      modules: selectedModuleIds.map((id) => ({ moduleId: id })),
      subModules: selectedSubModuleIds.map((id) => ({ subModuleId: id })),
      limits,
    });
    
    if (response.data) {
      return { id: response.data.id };
    }
    
    throw new Error('Failed to create package');
  },
}));
