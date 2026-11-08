"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/lib/mockData";
import { ATELIER_TEMPLATES } from "@/components/editor/templates";
import { calculateProductPrice } from "@/lib/pricing";
import { useCartStore } from "@/store/useCartStore";
import {
  Sparkles,
  Box,
  Scissors,
  Check,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sliders,
} from "@/components/ui/icons";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const product = INITIAL_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.choices.length > 0) {
        initial[opt.type] = opt.choices[0].value;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(product.minQuantity * 2);
  const [addedToast, setAddedToast] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);

  const priceBreakdown = calculateProductPrice({
    product,
    quantity,
    selectedOptions,
  });

  const handleOptionChange = (type: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    addItemToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      category: product.category,
      quantity,
      unitPrice: priceBreakdown.unitPrice,
      totalPrice: priceBreakdown.subtotal,
      selectedOptions,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  // Matching curated templates for this product category
  const matchingTemplates = ATELIER_TEMPLATES.filter(
    (t) =>
      t.category === product.category ||
      (product.category === "VISITING_CARD" && t.category === "VISITING_CARD") ||
      (product.category === "WEDDING_CARD" && t.category === "WEDDING_CARD") ||
      (product.isLaserCut && t.category === "NAME_PLATE")
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#8C8270] mb-8">
        <Link href="/" className="hover:text-[#12161A]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#12161A]">Catalog</Link>
        <span>/</span>
        <span className="text-[#12161A] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image & Prepress Visuals */}
        <div className="lg:col-span-6 space-y-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8E2D5] bg-[#F8F5EE] shadow-md relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1.5 rounded-md bg-[#12161A]/85 text-[#FDFBF7] text-xs font-medium backdrop-blur-sm">
                Trim: {product.specs.widthMm} x {product.specs.heightMm} mm
              </span>
              <span className="px-3 py-1.5 rounded-md bg-white/90 text-[#12161A] text-xs font-semibold backdrop-blur-sm border border-[#D4AF37]/50">
                +3mm Safe Bleed Included
              </span>
            </div>
          </div>

          {/* Quick Prepress Quality Guarantee */}
          <div className="bg-[#FAF7F0] p-6 rounded-xl border border-[#E5DEC9] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              <ShieldCheck size={18} />
              <span>The Vajra Prints Prepress Standard</span>
            </div>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              Every production batch is calibrated by Gangadhara / Ganesh on high-line-screen digital offset
              and CO2 laser equipment. A master digital proof PDF with crop marks and CMYK swatches is
              sent for your formal sign-off before production commences.
            </p>
          </div>

          {/* Curated Pre-built Templates for this Product */}
          {matchingTemplates.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    Prepress Layout Presets
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#12161A]">
                    Curated Templates for this Product
                  </h3>
                </div>
                <Link
                  href={`/editor?category=${product.category}`}
                  className="text-xs text-[#D4AF37] hover:underline font-semibold"
                >
                  All Templates →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingTemplates.slice(0, 4).map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-3 rounded-xl border border-[#E8E2D5] bg-[#FDFBF7] hover:border-[#D4AF37] transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-8 h-8 rounded-md shrink-0 border border-black/10 shadow-inner flex items-center justify-center text-[9px] font-bold"
                        style={{
                          backgroundColor: tmpl.thumbnailColor,
                          color: tmpl.thumbnailColor === "#12161A" ? "#D4AF37" : "#12161A",
                        }}
                      >
                        {tmpl.badge?.slice(0, 3).toUpperCase() || "ART"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold font-serif text-[#12161A] truncate block">
                          {tmpl.name}
                        </span>
                        <p className="text-[10px] text-[#8C8270] line-clamp-1 mt-0.5">
                          {tmpl.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/editor?category=${tmpl.category}&templateId=${tmpl.id}`}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#12161A] hover:bg-neutral-800 text-white text-[11px] font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles size={12} className="text-[#D4AF37]" />
                      <span>Customize Template in 2D Studio</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Configurator & Price Calculator */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              {product.category.replace("_", " ")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#12161A] mt-1">
              {product.name}
            </h1>
            <p className="text-sm text-[#5A5346] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Options Selectors */}
          <div className="space-y-6 pt-4 border-t border-[#E8E2D5]">
            {product.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#12161A] uppercase tracking-wider">
                    {option.name}:
                  </span>
                  <span className="text-[#8C8270]">
                    {option.choices.find((c) => c.value === selectedOptions[option.type])?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {option.choices.map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => handleOptionChange(option.type, choice.value)}
                      className={`p-3 rounded-xl border text-left text-xs transition ${
                        selectedOptions[option.type] === choice.value
                          ? "border-[#12161A] bg-[#12161A] text-[#FDFBF7] font-semibold shadow-sm"
                          : "border-[#E8E2D5] bg-white text-[#5A5346] hover:bg-[#F8F5EE]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{choice.label}</span>
                        {choice.priceDelta > 0 && (
                          <span
                            className={
                              selectedOptions[option.type] === choice.value
                                ? "text-[#D4AF37]"
                                : "text-[#8C8270]"
                            }
                          >
                            +₹{choice.priceDelta}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#12161A] uppercase tracking-wider">
                  Order Quantity:
                </span>
                <span className="font-serif font-bold text-base text-[#12161A]">
                  {quantity} units
                </span>
              </div>
              <input
                type="range"
                min={product.minQuantity}
                max={2500}
                step={product.minQuantity >= 50 ? 50 : 5}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#12161A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8C8270]">
                <span>Min: {product.minQuantity}</span>
                <span>250 (10% Tier Off)</span>
                <span>500 (18% Tier Off)</span>
                <span>1000+ (25% Tier Off)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Pricing Box */}
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E5DEC9] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C8270] block">
                  Calculated Net Investment
                </span>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#12161A]">
                  ₹{priceBreakdown.total.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-[#12161A] block">
                  ₹{priceBreakdown.unitPrice} / unit
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  GST 18% & Proof Included
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              {product.category === "CUSTOM_BOX" ? (
                <Link
                  href="/customizer/box"
                  className="py-3.5 px-6 bg-white text-[#12161A] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FDFBF7] transition flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <Box size={16} className="text-[#D4AF37]" />
                  <span>3D Box Wrapper</span>
                </Link>
              ) : product.isLaserCut ? (
                <Link
                  href="/laser-cutting"
                  className="py-3.5 px-6 bg-white text-[#12161A] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FDFBF7] transition flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <Scissors size={16} className="text-[#D4AF37]" />
                  <span>Vector Cut Calc</span>
                </Link>
              ) : (
                <Link
                  href={`/editor?category=${product.category}`}
                  className="py-3.5 px-6 bg-white text-[#12161A] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FDFBF7] transition flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <Sparkles size={16} className="text-[#D4AF37]" />
                  <span>Open 2D Studio</span>
                </Link>
              )}
            </div>

            {addedToast && (
              <p className="text-center text-xs font-semibold text-emerald-700">
                ✓ Added to your cart! Ready for checkout or further customization.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

