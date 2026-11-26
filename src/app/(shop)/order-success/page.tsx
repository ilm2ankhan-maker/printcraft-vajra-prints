"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "VP-2026-TEST";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5EFE6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 mb-6 shadow-sm">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-semibold text-[#12161A] mb-2">
          Order Confirmed!
        </h1>
        <p className="text-[#8C8270] text-sm mb-6">
          Thank you for your order with{" "}
          <span className="text-[#D4AF37] font-semibold">Vajra Prints</span>. Our artisans will
          begin crafting your design shortly.
        </p>

        {/* Reference Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-sm px-8 py-6 mb-6">
          <p className="text-xs uppercase tracking-wider text-[#8C8270] font-semibold mb-2">
            Your Order Reference
          </p>
          <p className="text-2xl font-mono font-bold text-[#12161A] tracking-widest">{ref}</p>

          <div className="mt-5 pt-4 border-t border-[#E8E2D5] space-y-3 text-sm text-left">
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✔</span>
              <span className="text-[#5A5346]">
                Order placed & payment confirmed successfully.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">🖨</span>
              <span className="text-[#5A5346]">
                Your design is now queued for press-ready proof generation by our team.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">📧</span>
              <span className="text-[#5A5346]">
                You'll receive a proof approval link via email before printing begins.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/orders/${ref}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#12161A] text-[#FDFBF7] rounded-xl text-sm font-semibold hover:bg-neutral-800 transition shadow-sm"
          >
            Track Your Order →
          </Link>
          <Link
            href={`/orders/${ref}/proof`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D4AF37]/70 bg-amber-50 text-amber-800 rounded-xl text-sm font-semibold hover:bg-amber-100 transition"
          >
            View Print Proof
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D6CEBD] text-[#5A5346] rounded-xl text-sm font-semibold hover:bg-[#F5EFE6] transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Admin link (subtle) */}
        <p className="mt-8 text-xs text-[#B0A898]">
          Staff?{" "}
          <Link href="/admin" className="hover:text-[#D4AF37] transition">
            View this order in Admin Dashboard →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
