export interface ProductOptionChoice {
  label: string;
  value: string;
  priceDelta: number;
  multiplier?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "paper" | "finish" | "size" | "corners" | "material" | "quantity";
  choices: ProductOptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category:
    | "VISITING_CARD"
    | "STICKER"
    | "BOOK_COVER"
    | "WEDDING_CARD"
    | "ENVELOPE"
    | "CUSTOM_BOX"
    | "LASER_CUTTING";
  basePrice: number;
  minQuantity: number;
  imageUrl: string;
  model3dUrl?: string;
  isLaserCut?: boolean;
  specs: {
    widthMm: number;
    heightMm: number;
    depthMm?: number;
    bleedMm: number;
    defaultUnit: "mm" | "inch";
  };
  options: ProductOption[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_wedding_cards",
    name: "Wedding Cards & Customized Envelopes",
    slug: "wedding-cards-customized-envelopes",
    description:
      "Royal wedding invitation suites with customized deckle-edge envelopes, traditional Kannada/English calligraphy, heated gold foil stamping, and wax seals.",
    category: "WEDDING_CARD",
    basePrice: 1800,
    minQuantity: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    specs: {
      widthMm: 127,
      heightMm: 178, // 5x7 inches
      bleedMm: 3.0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_wc_paper",
        name: "Paper Stock Base",
        type: "paper",
        choices: [
          { label: "Handmade Cotton Ivory Deckle", value: "deckle_ivory", priceDelta: 0 },
          { label: "350 GSM Textured Shimmer Board", value: "shimmer_350", priceDelta: 250 },
          { label: "Rich Royal Red Silk Board", value: "royal_red_silk", priceDelta: 350 },
          { label: "Gold Fleck Handmade Sheet", value: "gold_fleck", priceDelta: 450 },
        ],
      },
      {
        id: "opt_wc_foil",
        name: "Foiling & Embellishment",
        type: "finish",
        choices: [
          { label: "Champagne Gold Hot Foil", value: "gold_foil", priceDelta: 0 },
          { label: "Gleaming Rose Gold Foil", value: "rose_gold", priceDelta: 200 },
          { label: "Traditional Brass Debossing", value: "brass_deboss", priceDelta: 300 },
          { label: "Custom Wax Seal Stamp", value: "wax_seal", priceDelta: 350 },
        ],
      },
    ],
  },
  {
    id: "prod_name_plates",
    name: "Custom Name Plates (Gold, Silver, Copper, Pink)",
    slug: "custom-name-plates-metallic",
    description:
      "Laser-cut and engraved architectural name plates for homes, clinics, and executive offices. Precision finished in Gold, Silver, Copper, and Pink metallic acrylic/brass.",
    category: "LASER_CUTTING",
    basePrice: 1200,
    minQuantity: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isLaserCut: true,
    specs: {
      widthMm: 300,
      heightMm: 150,
      bleedMm: 0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_np_finish",
        name: "Metallic Plate Finish",
        type: "material",
        choices: [
          { label: "Mirror Gold Acrylic / Brass", value: "plate_gold", priceDelta: 0 },
          { label: "Brushed Silver Stainless Look", value: "plate_silver", priceDelta: 150 },
          { label: "Antique Copper / Rose Bronze", value: "plate_copper", priceDelta: 250 },
          { label: "Modern Metallic Pink Gloss", value: "plate_pink", priceDelta: 200 },
        ],
      },
    ],
  },
  {
    id: "prod_laser_cut",
    name: "Laser Engraving & Sub-Millimeter Cutting",
    slug: "laser-engraving-cutting",
    description:
      "High-precision CO2 and fiber laser engraving for MDF, birch ply, acrylic signage, leather, and metal gifts. Sub-millimeter vector path accuracy.",
    category: "LASER_CUTTING",
    basePrice: 750,
    minQuantity: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isLaserCut: true,
    specs: {
      widthMm: 300,
      heightMm: 200,
      bleedMm: 0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_laser_material",
        name: "Substrate Material",
        type: "material",
        choices: [
          { label: "3mm Baltic Birch Plywood", value: "birch_3mm", priceDelta: 0 },
          { label: "5mm Clear Cast Acrylic", value: "acrylic_5mm", priceDelta: 200 },
          { label: "3mm Frosted Black Acrylic", value: "acrylic_frosted", priceDelta: 280 },
          { label: "1.5mm Mirror Brass Sheet", value: "brass_sheet", priceDelta: 650 },
        ],
      },
    ],
  },
  {
    id: "prod_visiting_cards",
    name: "Visiting Cards & Corporate Stationery",
    slug: "visiting-cards-corporate-stationery",
    description:
      "Premium 350-400 GSM art card and cotton cards with thermal matte lamination, velvet soft touch, and precision spot UV or gold foiling.",
    category: "VISITING_CARD",
    basePrice: 450,
    minQuantity: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    specs: {
      widthMm: 89,
      heightMm: 51,
      bleedMm: 3.0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_vc_paper",
        name: "Paper Stock",
        type: "paper",
        choices: [
          { label: "350 GSM Art Card (Matte/Gloss)", value: "art_350", priceDelta: 0 },
          { label: "400 GSM Premium European Cotton", value: "cotton_400", priceDelta: 200 },
          { label: "350 GSM Textured Linen", value: "linen_350", priceDelta: 150 },
        ],
      },
      {
        id: "opt_vc_finish",
        name: "Finishing & Coating",
        type: "finish",
        choices: [
          { label: "Thermal Velvet Soft-Touch", value: "soft_touch", priceDelta: 100 },
          { label: "Spot UV Gloss on Logo", value: "spot_uv", priceDelta: 250 },
          { label: "Champagne Gold Foil Edge", value: "gold_foil", priceDelta: 300 },
        ],
      },
      {
        id: "opt_vc_corners",
        name: "Corners",
        type: "corners",
        choices: [
          { label: "Standard Sharp 90°", value: "sharp", priceDelta: 0 },
          { label: "Round Corner 6mm Die-Cut", value: "rounded", priceDelta: 80 },
        ],
      },
    ],
  },
  {
    id: "prod_invitations_certificates",
    name: "Event Invitations, Certificates & Brochures",
    slug: "invitations-certificates-brochures",
    description:
      "Institutional and ceremonial printing: annual day invites, convocation certificates with anti-counterfeit foils, and tri-fold corporate marketing brochures.",
    category: "BOOK_COVER",
    basePrice: 850,
    minQuantity: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    specs: {
      widthMm: 210,
      heightMm: 297, // A4
      bleedMm: 3.0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_doc_type",
        name: "Document Format",
        type: "paper",
        choices: [
          { label: "A4 Formal Certificate (300 GSM Parchment)", value: "cert_a4", priceDelta: 0 },
          { label: "Tri-Fold Full Color Brochure (170 GSM Gloss)", value: "brochure_trifold", priceDelta: 150 },
          { label: "Folded Event Invitation with Envelope", value: "event_invitation", priceDelta: 200 },
        ],
      },
    ],
  },
  {
    id: "prod_custom_box",
    name: "Custom Gift Boxes & Sweet Packaging",
    slug: "custom-gift-boxes-packaging",
    description:
      "Rigid luxury packaging boxes for wedding sweets, corporate return gifts, and jewelry with live 3D wrap previews.",
    category: "CUSTOM_BOX",
    basePrice: 1500,
    minQuantity: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    specs: {
      widthMm: 180,
      heightMm: 120,
      depthMm: 60,
      bleedMm: 5.0,
      defaultUnit: "mm",
    },
    options: [
      {
        id: "opt_box_board",
        name: "Board Quality",
        type: "paper",
        choices: [
          { label: "1200 GSM Kappa Board", value: "kappa_1200", priceDelta: 0 },
          { label: "1500 GSM Heavy Rigidity Board", value: "kappa_1500", priceDelta: 300 },
        ],
      },
    ],
  },
];

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedOptions: Record<string, string>;
    designId?: string;
    laserSpecs?: {
      cutLengthMm: number;
      areaCm2: number;
      material: string;
    };
  }>;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
  status:
    | "PLACED"
    | "PAID"
    | "PROOFING"
    | "PRINTING"
    | "FINISHING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  proofStatus: "PENDING" | "SENT_FOR_REVIEW" | "APPROVED" | "REVISION_REQUESTED";
  proofNotes?: string;
  proofUrl?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
}

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord_101",
    orderNumber: "VP-2026-101",
    customerName: "Karthik Gowda",
    customerEmail: "karthik.gowda@gmail.com",
    customerPhone: "+91 9945585603",
    shippingAddress: {
      line1: "#24, 4th Main, Malleshwaram",
      line2: "Near 8th Cross",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560003",
      country: "India",
    },
    items: [
      {
        productId: "prod_wedding_cards",
        productName: "Wedding Cards & Customized Envelopes",
        quantity: 250,
        unitPrice: 22,
        totalPrice: 5500,
        selectedOptions: {
          paper: "deckle_ivory",
          finish: "gold_foil",
        },
      },
    ],
    subtotal: 5500,
    taxAmount: 990,
    shippingFee: 0,
    totalAmount: 6490,
    currency: "INR",
    status: "PROOFING",
    proofStatus: "SENT_FOR_REVIEW",
    proofNotes: "Customer requested Kannada typography review on front fold.",
    courierName: "Professional Couriers",
    createdAt: "2026-11-07T10:30:00Z",
  },
  {
    id: "ord_102",
    orderNumber: "VP-2026-102",
    customerName: "Dr. Ananya Sharma",
    customerEmail: "dr.ananya@sharmaclinic.in",
    customerPhone: "+91 98450 12345",
    shippingAddress: {
      line1: "#102, 10th Cross, Jayanagar 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560011",
      country: "India",
    },
    items: [
      {
        productId: "prod_name_plates",
        productName: "Custom Name Plates (Gold, Silver, Copper, Pink)",
        quantity: 2,
        unitPrice: 1200,
        totalPrice: 2400,
        selectedOptions: {
          material: "plate_gold",
        },
      },
    ],
    subtotal: 2400,
    taxAmount: 432,
    shippingFee: 0,
    totalAmount: 2832,
    currency: "INR",
    status: "PRINTING",
    proofStatus: "APPROVED",
    proofNotes: "Mirror Gold acrylic laser engraving verified by Ganesh.",
    courierName: "Shiprocket / DTDC",
    createdAt: "2026-11-06T15:20:00Z",
  },
  {
    id: "ord_103",
    orderNumber: "VP-2026-103",
    customerName: "CMR Institute of Technology",
    customerEmail: "ise.dept@cmrit.ac.in",
    customerPhone: "+91 99455 85603",
    shippingAddress: {
      line1: "CMRIT Campus, 132 AECS Layout, ITPL Main Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560037",
      country: "India",
    },
    items: [
      {
        productId: "prod_invitations_certificates",
        productName: "Event Invitations, Certificates & Brochures",
        quantity: 200,
        unitPrice: 15,
        totalPrice: 3000,
        selectedOptions: {
          paper: "cert_a4",
        },
      },
    ],
    subtotal: 3000,
    taxAmount: 540,
    shippingFee: 0,
    totalAmount: 3540,
    currency: "INR",
    status: "FINISHING",
    proofStatus: "APPROVED",
    proofNotes: "Gold foil seal stamped on ISE Mini Project certificates.",
    courierName: "Shiprocket / Blue Dart",
    trackingNumber: "BD9928114092",
    trackingUrl: "https://shiprocket.co/tracking/BD9928114092",
    createdAt: "2026-11-05T09:15:00Z",
  },
];
