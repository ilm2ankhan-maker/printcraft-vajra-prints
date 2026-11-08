"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import {
  CreditCard,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  MapPin,
  Lock,
  Sparkles,
} from "@/components/ui/icons";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTax, getShipping, getTotal, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer & Shipping state
  const [customerName, setCustomerName] = useState("Karthik Gowda");
  const [customerEmail, setCustomerEmail] = useState("karthik.gowda@gmail.com");
  const [customerPhone, setCustomerPhone] = useState("+91 9945585603");
  const [line1, setLine1] = useState("#50, Obbaya Lane, Cottonpet 2nd Cross");
  const [line2, setLine2] = useState("Near Majestic / City Market");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560053");
  const [proofConsent, setProofConsent] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Dynamically load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const handlePayWithRazorpay = async (simulateDirect = false) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: {
            line1,
            line2,
            city,
            state,
            postalCode,
            country: "India",
          },
          items,
          subtotal,
          taxAmount: tax,
          shippingFee: shipping,
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize order.");
      }

      const { orderNumber, razorpayOrderId } = data;

      // 2. If simulated or test mode without popup
      if (simulateDirect || !window.Razorpay) {
        const verifyRes = await fetch("/api/checkout/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber,
            razorpayOrderId,
            razorpayPaymentId: `pay_sim_${Date.now()}`,
            razorpaySignature: "simulated_success_signature",
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          router.push(`/orders/${orderNumber}`);
          return;
        }
      }

      // 3. Launch Official Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKeyId",
        amount: data.amount,
        currency: data.currency,
        name: "PrintCraft - Vajra Prints",
        description: `Print Order ${orderNumber} (Vajra Prints)`,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80",
        order_id: razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#12161A",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderNumber,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/orders/${orderNumber}`);
            } else {
              setErrorMessage("Payment verification failed. Please contact atelier desk.");
            }
          } catch (err: any) {
            setErrorMessage(err.message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        setErrorMessage(resp.error?.description || "Payment was declined.");
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Checkout process error:", err);
      setErrorMessage(err.message || "Something went wrong during checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-3">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span>India Grounded Prepress Checkout</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#12161A] tracking-tight">
          Shipping & Razorpay Payment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contacts */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#12161A] border-b border-[#E8E2D5] pb-2">
              1. Customer & Prepress Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                  Phone (for Delivery & Proof WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                Email Address (Proof PDF will be delivered here) *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#12161A] border-b border-[#E8E2D5] pb-2">
              2. Courier Delivery Address (Shiprocket)
            </h2>
            <div>
              <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                Street Address / Building Name *
              </label>
              <input
                type="text"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                Landmark / Area (Optional)
              </label>
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7]"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Goa">Goa</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] text-xs bg-[#FDFBF7] text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Prepress Proofing Sign-off Acknowledgement */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-[#D4AF37]/50 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={proofConsent}
                onChange={(e) => setProofConsent(e.target.checked)}
                className="mt-0.5 accent-[#12161A]"
              />
              <span className="text-xs text-[#5A5346] leading-relaxed">
                <strong>Prepress Sign-Off Agreement:</strong> I acknowledge that a master high-res proof
                with trim crop marks will be sent for my approval prior to running physical press plates.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Order Summary & Razorpay Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-md space-y-5">
            <h2 className="font-serif font-bold text-xl text-[#12161A] border-b border-[#E8E2D5] pb-3">
              Order Breakdown
            </h2>

            <div className="space-y-3 text-xs text-[#5A5346]">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#12161A] block">
                      {it.quantity}x {it.productName}
                    </span>
                    <span className="text-[10px] text-[#8C8270]">
                      {it.category.replace("_", " ")}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[#12161A]">
                    ₹{it.totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E2D5] space-y-2 text-xs text-[#5A5346]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Logistics:</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C8270] block">
                  Total Payable (INR)
                </span>
                <span className="text-3xl font-serif font-bold text-[#12161A]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">
                All Taxes & Logistics Included
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Razorpay Main CTA */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handlePayWithRazorpay(false)}
                disabled={loading || !proofConsent}
                className="w-full py-4 px-6 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/50 disabled:opacity-50"
              >
                <CreditCard size={16} className="text-[#D4AF37]" />
                <span>
                  {loading ? "Connecting to Razorpay..." : `Pay ₹${total.toLocaleString("en-IN")} via Razorpay`}
                </span>
              </button>

              {/* Instant Sandbox Simulation Button for Easy Local Testing */}
              <button
                type="button"
                onClick={() => handlePayWithRazorpay(true)}
                disabled={loading || !proofConsent}
                className="w-full py-2.5 px-4 bg-emerald-700 text-white font-semibold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2"
              >
                <Check size={14} />
                <span>Simulate Instant UPI / Razorpay Success (Dev Mode)</span>
              </button>
            </div>

            {/* Indian Payment Badges */}
            <div className="pt-4 border-t border-[#E8E2D5] text-center space-y-2">
              <span className="text-[10px] text-[#8C8270] uppercase tracking-wider font-semibold block">
                Supported Indian Payment Channels:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5A5346] font-medium">
                <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2D5]">UPI (GPay / PhonePe / Paytm)</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2D5]">Debit & Credit Cards</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2D5]">Netbanking (50+ Banks)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

