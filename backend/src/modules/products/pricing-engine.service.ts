import { Injectable } from '@nestjs/common';
import { PriceRulesService } from './price-rules.service';

interface PricingContext {
  productId: string;
  quantity: number;
  customerId?: string;
  date?: Date;
}

@Injectable()
export class PricingEngineService {
  constructor(private priceRulesService: PriceRulesService) {}

  async calculatePrice(
    tenantId: string,
    basePrice: number,
    context: PricingContext,
  ): Promise<{ finalPrice: number; appliedRules: any[] }> {
    const rules = await this.priceRulesService.findAll(tenantId, true);
    
    let finalPrice = basePrice;
    const appliedRules = [];

    // Sort by priority (highest first)
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (this.evaluateConditions(rule.conditions, context)) {
        const discount = this.calculateDiscount(rule.calculation, finalPrice, context);
        finalPrice -= discount;
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          discount,
        });

        // If rule is exclusive (priority-based), stop after first match
        if (rule.priority > 0) {
          break;
        }
      }
    }

    return { finalPrice: Math.max(0, finalPrice), appliedRules };
  }

  private evaluateConditions(conditions: any, context: PricingContext): boolean {
    if (!conditions) return true;

    // Evaluate quantity conditions
    if (conditions.minQty && context.quantity < conditions.minQty) {
      return false;
    }

    if (conditions.maxQty && context.quantity > conditions.maxQty) {
      return false;
    }

    // Evaluate date conditions
    if (conditions.startDate) {
      const startDate = new Date(conditions.startDate);
      const currentDate = context.date || new Date();
      if (currentDate < startDate) {
        return false;
      }
    }

    if (conditions.endDate) {
      const endDate = new Date(conditions.endDate);
      const currentDate = context.date || new Date();
      if (currentDate > endDate) {
        return false;
      }
    }

    // Evaluate customer conditions
    if (conditions.customerId && conditions.customerId !== context.customerId) {
      return false;
    }

    return true;
  }

  private calculateDiscount(calculation: any, currentPrice: number, context: PricingContext): number {
    if (!calculation || !calculation.type) return 0;

    switch (calculation.type) {
      case 'percentage':
        return (currentPrice * (calculation.value || 0)) / 100;
      
      case 'flat':
        return calculation.value || 0;
      
      case 'formula':
        // Simple formula evaluation (could be enhanced with a proper expression parser)
        return this.evaluateFormula(calculation.formula, currentPrice, context);
      
      default:
        return 0;
    }
  }

  private evaluateFormula(formula: string, currentPrice: number, context: PricingContext): number {
    try {
      // SECURITY NOTE: For production, use a safe expression evaluator library like 'mathjs'
      // This simplified implementation should be replaced with a proper parser
      
      // Only allow simple mathematical operations and predefined variables
      const sanitized = formula
        .replace(/[^0-9+\-*/()\s.]/g, '') // Remove any non-mathematical characters
        .replace(/\{price\}/g, currentPrice.toString())
        .replace(/\{qty\}/g, context.quantity.toString());
      
      // Very basic validation - for production use mathjs or similar
      if (sanitized.length > 100 || /[a-zA-Z_$]/.test(sanitized)) {
        return 0; // Invalid formula
      }
      
      const result = new Function('return ' + sanitized)();
      return typeof result === 'number' && isFinite(result) ? result : 0;
    } catch {
      return 0;
    }
  }
}
