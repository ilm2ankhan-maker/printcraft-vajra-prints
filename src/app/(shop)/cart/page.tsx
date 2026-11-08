"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "@/components/ui/icons";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();
  const freeShippingThreshold = 2000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#12161A]/5 flex items-center justify-center mb-6 text-[#8C8270]">
          <ShoppingBag size={36} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#12161A]">
          Your Atelier Cart is Empty
        </h1>
        <p className="mt-3 text-sm text-[#5A5346] leading-relaxed">
          Explore our artisan stationery collections, craft a custom design in the 2D studio,
          or configure architectural laser cutting vectors.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-[#12161A] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            Browse Print Catalog
          </Link>
          <Link
            href="/editor"
            className="px-6 py-3 bg-white text-[#12161A] border border-[#D4AF37] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#FDFBF7] transition"
          >
            Launch 2D Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>Review Custom Orders</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#12161A] tracking-tight">
          Your Atelier Cart ({items.length} {items.length === 1 ? "Job" : "Jobs"})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Notification Bar */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-[#D4AF37]/40 text-xs text-[#5A5346] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#D4AF37]" />
              <span>
                {freeShippingRemaining > 0 ? (
                  <>
                    Add <strong>₹{freeShippingRemaining.toLocaleString("en-IN")}</strong> more
                    for <strong>Free Express Courier</strong> across India!
                  </>
                ) : (
                  <strong className="text-emerald-800">
                    ✓ You have qualified for FREE Express Courier delivery!
                  </strong>
                )}
              </span>
            </div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E8E2D5] shrink-0 relative">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                  {item.designSnapshot && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#12161A] text-[#D4AF37] text-[9px] font-bold">
                      CUSTOM
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8270]">
                    {item.category.replace("_", " ")}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#12161A]">
                    {item.productName}
                  </h3>

                  {/* Options & Specs */}
                  <div className="text-xs text-[#736A58] space-y-0.5">
                    {Object.entries(item.selectedOptions).map(([key, val]) => (
                      <span key={key} className="block capitalize">
                        <strong>{key}:</strong> {val}
                      </span>
                    ))}
                    {item.laserSpecs && (
                      <span className="block text-[#D4AF37] font-medium">
                        Laser Cut: {item.laserSpecs.cutLengthMm} mm path ({item.laserSpecs.areaCm2} cm²)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E8E2D5]">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#DCD5C5] rounded-lg bg-[#FAF7F0]">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 10)}
                    disabled={item.quantity <= 1}
                    className="p-2 text-neutral-600 hover:text-black disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-xs font-mono font-semibold text-[#12161A]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 10)}
                    className="p-2 text-neutral-600 hover:text-black"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total Item Price */}
                <div className="text-right min-w-[90px]">
                  <span className="text-base font-serif font-bold text-[#12161A] block">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[#8C8270]">
                    ₹{item.unitPrice}/unit
                  </span>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 transition"
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-md space-y-5">
            <h2 className="font-serif font-bold text-xl text-[#12161A] border-b border-[#E8E2D5] pb-3">
              Order Investment Summary
            </h2>

            <div className="space-y-3 text-xs text-[#5A5346]">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} units):</span>
                <span className="font-semibold text-[#12161A]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Print Services):</span>
                <span className="font-semibold text-[#12161A]">
                  ₹{tax.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured Express Courier:</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D5] flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C8270] block">
                  Total Payable
                </span>
                <span className="text-3xl font-serif font-bold text-[#12161A]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">
                Prepress Proof Included
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/50"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#8C8270]">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span>Razorpay 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

