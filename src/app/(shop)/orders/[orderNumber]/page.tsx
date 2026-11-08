"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Printer,
  ShieldCheck,
  Truck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileCheck,
} from "@/components/ui/icons";
import { OrderRecord } from "@/lib/mockData";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${resolvedParams.orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  }, [resolvedParams.orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-serif font-bold text-[#12161A]">Order Not Found</h1>
        <p className="text-xs text-[#8C8270] mt-2">
          We could not locate order reference &quot;{resolvedParams.orderNumber}&quot;.
        </p>
        <Link href="/" className="mt-6 px-4 py-2 bg-[#12161A] text-white rounded text-xs">
          Return to Atelier Home
        </Link>
      </div>
    );
  }

  const pipelineSteps = [
    { key: "PLACED", label: "Placed" },
    { key: "PAID", label: "Paid" },
    { key: "PROOFING", label: "Proofing" },
    { key: "PRINTING", label: "Printing" },
    { key: "FINISHING", label: "Finishing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentStepIdx = pipelineSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E2D5] shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <Check size={14} />
              <span>Order Confirmed & Prepress Queued</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#12161A]">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-[#8C8270] mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#8C8270] block">Total Amount Paid</span>
            <span className="text-3xl font-serif font-bold text-[#12161A]">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-700 block font-medium">
              Payment Verified via Razorpay
            </span>
          </div>
        </div>

        {/* Pipeline Progress Stepper */}
        <div className="pt-8">
          <span className="text-xs uppercase tracking-widest text-[#8C8270] font-semibold block mb-4">
            Production & Delivery Pipeline
          </span>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {pipelineSteps.map((step, idx) => {
              const isDone = idx <= (currentStepIdx >= 0 ? currentStepIdx : 1);
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="text-center">
                  <div
                    className={`h-2 rounded-full mb-2 transition-all ${
                      isDone
                        ? "bg-[#D4AF37]"
                        : "bg-[#E8E2D5]"
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-xs block font-medium ${
                      isCurrent
                        ? "text-[#12161A] font-bold"
                        : isDone
                        ? "text-[#5A5346]"
                        : "text-[#B3A996]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prepress Proof Approval Action Banner */}
      <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/50 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <FileCheck size={18} />
            <span>Prepress Proof Review Portal</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#12161A]">
            Digital Artwork & Trim Alignment Proof
          </h2>
          <p className="text-xs text-[#5A5346] leading-relaxed max-w-xl">
            {order.proofStatus === "APPROVED"
              ? "✓ You have signed off on this proof. Printing plates are calibrated and mounted."
              : order.proofStatus === "REVISION_REQUESTED"
              ? "Artwork revision requested. Prepress operator is making adjustments."
              : "Inspect the 300 DPI trim lines, bleed boundaries, and foil channels before we authorize the press operator."}
          </p>
        </div>

        <Link
          href={`/orders/${order.orderNumber}/proof`}
          className="px-6 py-3.5 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles size={16} className="text-[#D4AF37]" />
          <span>
            {order.proofStatus === "APPROVED"
              ? "View Approved Proof"
              : "Review & Sign Off Proof"}
          </span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid: Logistics & Ordered Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping & Shiprocket Tracking */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#12161A] flex items-center gap-2">
            <Truck size={18} className="text-[#D4AF37]" />
            <span>Courier Logistics (Shiprocket)</span>
          </h3>

          <div className="text-xs text-[#5A5346] space-y-2">
            <div className="flex justify-between">
              <span>Courier Partner:</span>
              <span className="font-semibold text-[#12161A]">{order.courierName || "Blue Dart Apex Air"}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span>Airway Bill (AWB):</span>
                <span className="font-mono font-semibold text-[#12161A]">{order.trackingNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Recipient:</span>
              <span className="font-medium text-[#12161A]">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-right text-[#12161A]">
                {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </span>
            </div>
          </div>

          {order.trackingUrl && (
            <div className="pt-2">
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                <span>Live Shiprocket Tracking</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Items in this Order */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#12161A]">
            Ordered Print Jobs ({order.items.length})
          </h3>

          <div className="divide-y divide-[#E8E2D5] text-xs">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-3 flex justify-between items-start">
                <div>
                  <span className="font-semibold text-[#12161A] block">
                    {it.quantity}x {it.productName}
                  </span>
                  {it.selectedOptions && (
                    <span className="text-[11px] text-[#8C8270] block">
                      {Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </span>
                  )}
                  {it.laserSpecs && (
                    <span className="text-[11px] text-[#D4AF37] block">
                      Cut Path: {it.laserSpecs.cutLengthMm} mm
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-[#12161A]">
                  ₹{it.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2D5] flex justify-between text-xs font-semibold text-[#12161A]">
            <span>Net Paid Amount:</span>
            <span className="font-mono font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

