# Ivory & Ink Atelier 🏛️✨
### Bespoke Fine Art Printmakers & 3D Packaging Studio (Kala Ghoda, Mumbai)

A production-grade, 3D-animated e-commerce and fabrication platform for the luxury local printing business **"Ivory & Ink"**. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, Supabase, Fabric.js, React Three Fiber (R3F), Drei, GSAP, Zustand, `pdf-lib`, Razorpay, Resend, and Shiprocket.

---

## 🌟 Key Features & Capabilities

### 1. 3D Animated Landing Page & Local Mumbai Atelier
- **Procedural 3D Scene (`Background3D.tsx`)**: Floating cotton envelopes, gilded wax seals, deckle paper cards, and champagne sparkles built in **React Three Fiber** and **Three.js**.
- **GSAP Scroll Motion**: Smooth camera choreography and 3D object rotation that responds fluidly to page scroll.
- **Dynamic Homepage Cost Estimator**: Instant interactive calculator with quantity slider, paper choices, foil selections, and volume discount thresholds.
- **Kala Ghoda Studio Contact**: Dedicated contact page with address, phone numbers, Google Maps integration, direct WhatsApp consultation, and walk-in consultation details.

### 2. Mini Canva-Like 2D Design Studio (`/editor`)
- **Interactive Fabric.js Canvas**:
  - Add and style typography (Headlines, Subheadings, Body) with serif, modern sans, and typewriter fonts.
  - Full font formatting: size, alignment, character spacing, bold, italic, and curated luxury color presets (Charcoal Noir, Champagne Gold `#D4AF37`, Emerald, Terracotta, Crimson).
  - Add geometric shapes (boxes, circles) and gilded foil borders.
  - Drag-and-drop / file upload for customer logos and vector graphics.
  - Curated template library for Visiting Cards, Die-Cut Vinyl Stickers, Royal Wedding Suites, Envelopes, and Book Covers.
- **Prepress Visual Guides**:
  - Red dashed **3mm Bleed Margin** boundary.
  - Solid **Trim Line** indicating guillotine knife cut.
  - Green dashed **Safe Content Zone**.
  - Toggle view to preview with or without print marks.
- **300 DPI Print Master PDF Export (`src/lib/pdfExport.ts`)**:
  - Generates print-ready PDFs at exact millimeter dimensions with 3mm bleed using `pdf-lib`.
  - Embeds standard guillotine crop marks in all 4 corners.
  - Adds 6-swatch CMYK/spot-color calibration bar and job production metadata.

### 3. 3D Product Customization & Laser Cutting
- **3D Rigid Packaging Box Customizer (`/customizer/box`)**:
  - Full 360° orbital preview using React Three Fiber.
  - Seamless bridge from the 2D editor: any custom artwork created in the Canva studio can be pushed directly as a real-time texture onto the 3D box model.
  - Interactive box dimensions (Length, Width, Height), closure styles (Magnetic flap vs. Lid & Base), and board weight (1200 GSM / 1500 GSM).
- **Sub-Millimeter Laser Cutting Engine (`/laser-cutting`)**:
  - Vector toolpath simulator on an optical CNC laser bed canvas with glowing laser head animation.
  - Preset architectural lattices (Moroccan Jali, Acanthus Mandala, Hexagonal Crest, Coaster Quad).
  - SVG/DXF vector parser: extracts total cutting path length (mm), area (cm²), and piercing points.
  - Substrate selector: 3mm Baltic Birch Plywood, 5mm Clear Cast Acrylic, 3mm Matte Black Frosted Acrylic, 1.5mm Mirror Brass Sheet.
  - Algorithmic price calculation based on material rate, path cut length, piercing count, and setup fee.

### 4. Product Catalog & Dynamic Pricing
- Dedicated print catalog (`/products`) with category filtering, search, and detailed specifications.
- Product details (`/products/[slug]`) with options configurator, volume discount pricing engine, and instant cart additions.

### 5. Shopping Cart, Checkout & Razorpay (India Grounded)
- Global client-side cart persisted in LocalStorage via **Zustand**.
- Full GST calculation (18% for print services in India) and free courier delivery over ₹2,000.
- **Razorpay Checkout Integration (`/checkout`)**:
  - Supports UPI (Google Pay, PhonePe, Paytm, BHIM, QR), Debit & Credit cards (Visa, Mastercard, RuPay), and Netbanking across 50+ Indian banks.
  - Cryptographic HMAC-SHA256 signature verification via `/api/checkout/verify-payment`.
  - Built-in simulated success button for test/sandbox execution.

### 6. Prepress Proofing, Resend Email & Shiprocket Logistics
- Dedicated digital proof review portal (`/orders/[orderNumber]/proof`):
  - High-resolution artwork inspection with crop marks, bleed zone, and CMYK bars.
  - Customer can **"Approve Proof & Authorize Printing"** or **"Request Prepress Revision"** with notes.
- Email dispatches via **Resend** for order confirmations and proof review approvals.
- Courier booking and live tracking integration via **Shiprocket API**.

### 7. Staff Admin Dashboard (`/admin`)
- Prepress control room to manage the order lifecycle:
  `PLACED` ➔ `PAID` ➔ `PROOFING` ➔ `PRINTING` ➔ `FINISHING` ➔ `SHIPPED` ➔ `DELIVERED`.
- Live pipeline metrics, search by customer/order ref, one-click stage advancement, and proof email dispatch.

---

## 📁 Project Structure

```
ivory-ink/
├── prisma/
│   └── schema.prisma           # Relational schema (User, Product, ProductOption, Template, Design, Order, Payment)
├── src/
│   ├── app/
│   │   ├── (shop)/
│   │   │   ├── cart/page.tsx           # Shopping cart with volume pricing & shipping
│   │   │   ├── checkout/page.tsx       # Razorpay checkout with Indian address & proof consent
│   │   │   ├── contact/page.tsx        # Local shop contact & WhatsApp consultation
│   │   │   ├── customizer/box/page.tsx # 3D custom packaging box customizer
│   │   │   ├── editor/page.tsx         # Mini Canva-like 2D visual editor
│   │   │   ├── laser-cutting/page.tsx  # Architectural laser vector cutting calculator
│   │   │   ├── orders/[orderNumber]/page.tsx       # Order details & pipeline tracker
│   │   │   ├── orders/[orderNumber]/proof/page.tsx # Interactive prepress proof sign-off
│   │   │   ├── products/page.tsx       # Catalog with search & filter
│   │   │   └── products/[slug]/page.tsx# Product configurator & price engine
│   │   ├── admin/
│   │   │   └── page.tsx                # Staff pipeline & prepress queue dashboard
│   │   ├── api/
│   │   │   ├── admin/orders/route.ts   # Pipeline update & proof dispatch
│   │   │   ├── checkout/create-order/route.ts # Order creation & Razorpay init
│   │   │   ├── checkout/verify-payment/route.ts # Cryptographic payment verification
│   │   │   └── orders/[orderNumber]/proof/route.ts # Proof approval & revision endpoints
│   │   ├── globals.css                 # Tailwind CSS 4 theme & luxury print styles
│   │   ├── layout.tsx                  # Root layout with fonts & Navbar/Footer
│   │   └── page.tsx                    # Landing page with 3D background & live estimator
│   ├── components/
│   │   ├── editor/
│   │   │   ├── FabricEditor.tsx        # Fabric.js canvas editor component
│   │   │   └── templates.ts            # Curated atelier design templates
│   │   ├── customizer/
│   │   │   └── Box3DCustomizer.tsx     # R3F 3D box model with live canvas texture bridge
│   │   ├── ui/
│   │   │   ├── Background3D.tsx        # Three.js / R3F animated envelope scene
│   │   │   ├── Footer.tsx              # Atelier footer with studio coordinates
│   │   │   ├── icons.tsx               # Dedicated handcrafted SVG icon suite
│   │   │   └── Navbar.tsx              # Brand header with status indicator & cart badge
│   ├── lib/
│   │   ├── mockData.ts                 # Product catalog & seeded orders
│   │   ├── orderStore.ts               # In-memory persistence bridge for orders
│   │   ├── pdfExport.ts                # 300 DPI print-ready PDF engine with 3mm bleed
│   │   ├── pricing.ts                  # Dynamic pricing calculator & laser algorithm
│   │   ├── razorpay.ts                 # Razorpay order creator & signature verifier
│   │   ├── resend.ts                   # Resend email notification templates
│   │   ├── shiprocket.ts               # Shiprocket courier logistics helper
│   │   └── supabase.ts                 # Supabase client & asset upload helper
│   └── store/
│       ├── useCartStore.ts             # Persistent Zustand cart
│       └── useDesignStore.ts           # 2D canvas state & 3D texture sync store
├── .env.example                        # Template for environment configuration
└── tsconfig.json                       # Path aliases (@/* -> ./src/*)
```

---

## 🚀 Running the Project Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and populate credentials for Supabase, Razorpay, Resend, and Shiprocket:
   ```bash
   cp .env.example .env.local
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the website.

4. **Build for Production**:
   ```bash
   npm run build
   ```
