import { Product } from "./mockData";

export interface CalculatePriceInput {
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
  laserSpecs?: {
    cutLengthMm: number;
    widthMm: number;
    heightMm: number;
    material: string;
    pierceCount?: number;
  };
}

export interface PriceBreakdown {
  baseUnitRate: number;
  optionsDelta: number;
  quantityDiscountPercent: number;
  unitPrice: number;
  subtotal: number;
  taxGst: number; // 18%
  shippingFee: number;
  total: number;
  laserBreakdown?: {
    materialCost: number;
    cuttingTimeCost: number;
    setupFee: number;
    pierceCost: number;
  };
}

export function calculateProductPrice(input: CalculatePriceInput): PriceBreakdown {
  const { product, quantity, selectedOptions, laserSpecs } = input;

  // Handle Laser Cutting specialized calculation
  if (product.isLaserCut && laserSpecs) {
    const areaCm2 = (laserSpecs.widthMm * laserSpecs.heightMm) / 100;
    
    // Substrate material rate per cm²
    let materialRatePerCm2 = 0.65; // Birch 3mm
    if (laserSpecs.material.includes("acrylic_5mm")) materialRatePerCm2 = 1.35;
    else if (laserSpecs.material.includes("acrylic_frosted")) materialRatePerCm2 = 1.6;
    else if (laserSpecs.material.includes("brass")) materialRatePerCm2 = 3.8;

    const materialCost = Math.round(areaCm2 * materialRatePerCm2);
    // Cutting path rate: ~₹0.08 per mm of laser cut length
    const cuttingTimeCost = Math.round(laserSpecs.cutLengthMm * 0.08);
    const pierceCost = (laserSpecs.pierceCount || 4) * 5;
    const setupFee = 250;

    const unitPrice = Math.max(
      product.basePrice,
      materialCost + cuttingTimeCost + pierceCost + setupFee
    );

    const subtotal = unitPrice * quantity;
    const taxGst = Math.round(subtotal * 0.18);
    const shippingFee = subtotal > 1500 ? 0 : 120;
    const total = subtotal + taxGst + shippingFee;

    return {
      baseUnitRate: product.basePrice,
      optionsDelta: 0,
      quantityDiscountPercent: 0,
      unitPrice,
      subtotal,
      taxGst,
      shippingFee,
      total,
      laserBreakdown: {
        materialCost,
        cuttingTimeCost,
        setupFee,
        pierceCost,
      },
    };
  }

  // Standard print product calculation
  let optionsDeltaTotal = 0;
  for (const option of product.options) {
    const selectedValue = selectedOptions[option.type];
    if (selectedValue) {
      const match = option.choices.find((c) => c.value === selectedValue);
      if (match) {
        optionsDeltaTotal += match.priceDelta;
      }
    }
  }

  // Base unit rate (basePrice is for minQuantity)
  const baseRatePerUnit = product.basePrice / product.minQuantity;
  const optionsDeltaPerUnit = optionsDeltaTotal / product.minQuantity;

  // Tiered volume discount
  let discountPercent = 0;
  if (quantity >= 1000) {
    discountPercent = 25;
  } else if (quantity >= 500) {
    discountPercent = 18;
  } else if (quantity >= 250) {
    discountPercent = 10;
  } else if (quantity >= 100) {
    discountPercent = 5;
  }

  const effectiveUnitCost = (baseRatePerUnit + optionsDeltaPerUnit) * (1 - discountPercent / 100);
  const unitPrice = Math.round(effectiveUnitCost * 100) / 100;
  const subtotal = Math.round(unitPrice * quantity);
  const taxGst = Math.round(subtotal * 0.18); // 18% GST on print
  const shippingFee = subtotal >= 2000 ? 0 : 120; // Free shipping above ₹2,000
  const total = subtotal + taxGst + shippingFee;

  return {
    baseUnitRate: Math.round(baseRatePerUnit * 100) / 100,
    optionsDelta: Math.round(optionsDeltaPerUnit * 100) / 100,
    quantityDiscountPercent: discountPercent,
    unitPrice,
    subtotal,
    taxGst,
    shippingFee,
    total,
  };
}

