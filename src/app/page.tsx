"use client";

import React, { useState } from "react";
import Link from "next/link";
import Background3D from "@/components/Background3D";
import {
  Printer,
  Sparkles,
  Layers,
  Box,
  Scissors,
  ShieldCheck,
  ChevronRight,
  Phone,
  Clock,
  MapPin,
  ShoppingBag,
  Check,
  ArrowRight,
  Sliders,
} from "@/components/ui/icons";
import { INITIAL_PRODUCTS, Product } from "@/lib/mockData";
import { calculateProductPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/useCartStore";

export default function HomePage() {
  const [selectedProductSlug, setSelectedProductSlug] = useState(
    INITIAL_PRODUCTS[0].slug
  );
  const [calculatorQty, setCalculatorQty] = useState(250);
  const [selectedFinish, setSelectedFinish] = useState("gold_foil");
  const [addedToast, setAddedToast] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);

  const activeProduct =
    INITIAL_PRODUCTS.find((p) => p.slug === selectedProductSlug) ||
    INITIAL_PRODUCTS[0];

  const priceBreakdown = calculateProductPrice({
    product: activeProduct,
    quantity: calculatorQty,
    selectedOptions: {
      finish: selectedFinish,
    },
  });

  const handleQuickAdd = () => {
    addItemToCart({
      productId: activeProduct.id,
      productName: activeProduct.name,
      productImage: activeProduct.imageUrl,
      category: activeProduct.category,
      quantity: calculatorQty,
      unitPrice: priceBreakdown.unitPrice,
      totalPrice: priceBreakdown.subtotal,
      selectedOptions: {
        finish: selectedFinish,
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Animated Background with Three.js & R3F */}
      <Background3D />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span>Cottonpet, Bengaluru · Vajra Prints (Prop. Gangadhara / Ganesh)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#12161A] tracking-tight leading-[1.12]">
            PrintCraft{" "}
            <span className="gold-gradient-text italic font-normal">
              by Vajra Prints.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#5A5346] leading-relaxed font-normal">
            Bespoke wedding cards & customized envelopes, precision laser engraving & cutting,
            custom metallic name plates (Gold, Silver, Copper, Pink), business visiting cards,
            ceremonial invitations, official certificates, and multi-fold corporate brochures.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm uppercase tracking-wider font-semibold bg-[#12161A] text-[#FDFBF7] rounded-md hover:bg-neutral-800 transition shadow-lg border border-[#D4AF37]/50 group"
            >
              <Sparkles size={18} className="text-[#D4AF37] group-hover:rotate-12 transition" />
              <span>Launch 2D Design Studio</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/customizer/box"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm uppercase tracking-wider font-semibold bg-white/80 hover:bg-white text-[#12161A] rounded-md border border-[#E5DEC9] transition shadow-sm backdrop-blur-sm"
            >
              <Box size={18} className="text-[#8C8270]" />
              <span>3D Custom Box Wrapper</span>
            </Link>

            <Link
              href="/laser-cutting"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm uppercase tracking-wider font-semibold bg-white/80 hover:bg-white text-[#12161A] rounded-md border border-[#E5DEC9] transition shadow-sm backdrop-blur-sm"
            >
              <Scissors size={18} className="text-[#8C8270]" />
              <span>Laser Cutting Engine</span>
            </Link>
          </div>

          {/* Heritage Metrics */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#E8E2D5]/80">
            <div className="space-y-1">
              <span className="text-2xl font-serif font-bold text-[#12161A]">300 DPI</span>
              <p className="text-xs text-[#8C8270]">Certified Prepress + 3mm Bleed</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-serif font-bold text-[#12161A]">400-600</span>
              <p className="text-xs text-[#8C8270]">GSM European Cotton Stock</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-serif font-bold text-[#12161A]">0.1 mm</span>
              <p className="text-xs text-[#8C8270]">CO2 Vector Laser Precision</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-serif font-bold text-[#12161A]">24-48 Hr</span>
              <p className="text-xs text-[#8C8270]">Bengaluru Rush Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Price Calculator Widget */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-[#E5DEC9] rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[#E8E2D5]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                <Sliders size={16} />
                <span>Instant Prepress Cost Estimator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#12161A] mt-1">
                Real-Time Dynamic Pricing Engine
              </h2>
              <p className="text-sm text-[#736A58] mt-1">
                Configure your print stock, foil embellishment, and quantities with instant volume tier discounts.
              </p>
            </div>

            {/* Product Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {INITIAL_PRODUCTS.map((prod) => (
                <button
                  key={prod.slug}
                  onClick={() => {
                    setSelectedProductSlug(prod.slug);
                    setCalculatorQty(Math.max(prod.minQuantity, calculatorQty));
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedProductSlug === prod.slug
                      ? "bg-[#12161A] text-[#FDFBF7] shadow-sm"
                      : "bg-[#F3EFE6] text-[#5A5346] hover:bg-[#ECE6D8]"
                  }`}
                >
                  {prod.name.split(" ")[0]} {prod.name.split(" ")[1] || ""}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            {/* Column 1: Product Preview & Specs */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E8E2D5] bg-[#F8F5EE] relative">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#12161A]/80 text-[#FDFBF7] text-[11px] font-medium backdrop-blur-sm">
                  {activeProduct.specs.widthMm} x {activeProduct.specs.heightMm} mm
                </span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#12161A]">
                  {activeProduct.name}
                </h3>
                <p className="text-xs text-[#736A58] mt-1 leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>
            </div>

            {/* Column 2: Interactive Controls */}
            <div className="space-y-6">
              {/* Quantity Slider */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-[#12161A]">Print Quantity:</span>
                  <span className="font-serif font-bold text-base text-[#12161A]">
                    {calculatorQty} units
                  </span>
                </div>
                <input
                  type="range"
                  min={activeProduct.minQuantity}
                  max={2000}
                  step={activeProduct.minQuantity >= 50 ? 50 : 5}
                  value={calculatorQty}
                  onChange={(e) => setCalculatorQty(Number(e.target.value))}
                  className="w-full accent-[#12161A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#8C8270] mt-1">
                  <span>Min: {activeProduct.minQuantity}</span>
                  <span>500 (18% Off)</span>
                  <span>1000+ (25% Off)</span>
                </div>
              </div>

              {/* Finish Options */}
              {activeProduct.options.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-[#12161A] block mb-2">
                    {activeProduct.options[0].name}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProduct.options[0].choices.map((choice) => (
                      <button
                        key={choice.value}
                        onClick={() => setSelectedFinish(choice.value)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition ${
                          selectedFinish === choice.value
                            ? "border-[#D4AF37] bg-[#FDFBF7] font-semibold text-[#12161A] shadow-sm"
                            : "border-[#E8E2D5] bg-white text-[#5A5346] hover:bg-[#F8F5EE]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{choice.label}</span>
                          {choice.priceDelta > 0 && (
                            <span className="text-[#8C8270] text-[10px]">
                              +₹{choice.priceDelta}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Volume Discount Alert */}
              {priceBreakdown.quantityDiscountPercent > 0 && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>
                    <strong>{priceBreakdown.quantityDiscountPercent}% Volume Tier Discount</strong> applied to base rate!
                  </span>
                </div>
              )}
            </div>

            {/* Column 3: Live Price Summary & Actions */}
            <div className="bg-[#FAF7F0] p-6 rounded-xl border border-[#E5DEC9] flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C8270] font-medium">
                  Estimated Prepress Total
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#12161A]">
                    ₹{priceBreakdown.total.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#8C8270]">
                    (₹{priceBreakdown.unitPrice}/unit)
                  </span>
                </div>

                <div className="mt-6 space-y-2 text-xs border-t border-[#E8E2D5] pt-4 text-[#5A5346]">
                  <div className="flex justify-between">
                    <span>Subtotal ({calculatorQty} pcs):</span>
                    <span>₹{priceBreakdown.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% Print Tax):</span>
                    <span>₹{priceBreakdown.taxGst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Shipping:</span>
                    <span>
                      {priceBreakdown.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">FREE (Above ₹2,000)</span>
                      ) : (
                        `₹${priceBreakdown.shippingFee}`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleQuickAdd}
                  className="w-full py-3 px-4 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Shopping Cart</span>
                </button>

                <Link
                  href={`/editor?category=${activeProduct.category}`}
                  className="w-full py-3 px-4 bg-white text-[#12161A] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FDFBF7] transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles size={16} className="text-[#D4AF37]" />
                  <span>Customize in 2D Studio</span>
                </Link>

                {addedToast && (
                  <p className="text-center text-xs font-semibold text-emerald-700 animate-fade-in">
                    ✓ Added to cart successfully!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Atelier Catalog Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            Atelier Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#12161A] mt-2">
            Signature Print & Fabrication Suites
          </h2>
          <p className="text-sm text-[#5A5346] mt-2">
            Each piece is calibrated for exact 300 DPI trim boundaries, high-density pigment ink,
            and hand-finished tactile quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="card-luxury rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden relative group">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-4 text-white text-xs font-medium tracking-wide">
                    Starting ₹{prod.basePrice} / {prod.minQuantity} pcs
                  </span>
                </div>

                <div className="p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8270]">
                    {prod.category.replace("_", " ")}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#12161A] mt-1">
                    {prod.name}
                  </h3>
                  <p className="text-sm text-[#5A5346] mt-2 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E8E2D5]/60 mt-4">
                <span className="text-xs text-[#8C8270]">
                  Trim: {prod.specs.widthMm} x {prod.specs.heightMm} mm
                </span>

                <div className="flex items-center gap-2">
                  {prod.isLaserCut ? (
                    <Link
                      href="/laser-cutting"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#12161A] hover:text-[#D4AF37] transition"
                    >
                      <span>Calculate</span>
                      <ChevronRight size={14} />
                    </Link>
                  ) : prod.category === "CUSTOM_BOX" ? (
                    <Link
                      href="/customizer/box"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#12161A] hover:text-[#D4AF37] transition"
                    >
                      <span>3D Preview</span>
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <Link
                      href={`/editor?category=${prod.category}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#12161A] hover:text-[#D4AF37] transition"
                    >
                      <span>Customize</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Cottonpet Studio Walk-in & Consultation Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#12161A] text-[#FDFBF7] rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Visit Cottonpet Studio • Bengaluru
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Consult with Gangadhara / Ganesh at Vajra Prints
            </h2>
            <p className="text-sm sm:text-base text-[#A29780] leading-relaxed">
              Touch physical paper swatch books, inspect metallic name plates in Gold, Silver, Copper,
              and Pink, test laser engraving kerf samples, or approve your wedding invitation proofs in person.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#E8E2D5]">
                <MapPin size={18} className="text-[#D4AF37]" />
                <span>#50, Obbaya Lane, Cottonpet 2nd Cross, Bengaluru - 560053</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#E8E2D5]">
                <Clock size={18} className="text-[#D4AF37]" />
                <span>Mon - Sat: 9:00 AM to 9:00 PM | Sunday by Appointment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#E8E2D5]">
                <Phone size={18} className="text-[#D4AF37]" />
                <span>Direct / WhatsApp: +91 9945585603</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-[#D4AF37] text-[#12161A] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-400 transition shadow-lg"
              >
                Send Studio Inquiry
              </Link>
              <a
                href="https://wa.me/919945585603?text=Hello%20Vajra%20Prints,%20I%20would%20like%20to%20consult%20on%20a%20print%20/%20laser%20cutting%20order."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-700 transition border border-white/20"
              >
                Chat on WhatsApp (+91 9945585603)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
