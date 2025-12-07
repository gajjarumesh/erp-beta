export interface LineCalculationInput {
  qty: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
}

export interface LineCalculationTotals {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
}

export class SalesCalculationHelper {
  static calculateLineTotal(line: LineCalculationInput): number {
    const discount = line.discount || 0;
    const taxRate = line.taxRate || 0;
    
    const subtotal = line.qty * line.unitPrice;
    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * taxRate) / 100;
    return afterDiscount + tax;
  }

  static calculateTotals(lines: LineCalculationInput[]): LineCalculationTotals {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;

    lines.forEach(line => {
      const lineSubtotal = line.qty * line.unitPrice;
      subtotal += lineSubtotal;
      discountTotal += line.discount || 0;
      taxTotal += ((lineSubtotal - (line.discount || 0)) * (line.taxRate || 0)) / 100;
    });

    const total = subtotal - discountTotal + taxTotal;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }
}
