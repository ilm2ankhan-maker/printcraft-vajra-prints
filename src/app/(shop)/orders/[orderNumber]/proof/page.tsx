"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Check,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "@/components/ui/icons";
import { OrderRecord } from "@/lib/mockData";

export default function ProofReviewPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const fetchOrder = () => {
    fetch(`/api/orders/${resolvedParams.orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error("Error fetching order:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [resolvedParams.orderNumber]);

  const handleApproveProof = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${resolvedParams.orderNumber}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          notes: "Customer signed off master digital proof online.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("✓ Proof Approved! Job has moved to the Heidelberg print queue.");
        fetchOrder();
      }
    } catch (err) {
      console.error("Proof approval error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${resolvedParams.orderNumber}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST_REVISION",
          notes: revisionNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("✓ Revision request sent to prepress operator.");
        setShowRevisionModal(false);
        fetchOrder();
      }
    } catch (err) {
      console.error("Proof revision error:", err);
    } finally {
      setSubmitting(false);
    }
  };

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
        <Link href="/" className="mt-4 text-xs underline">Back to home</Link>
      </div>
    );
  }

  const firstItem = order.items[0];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#8C8270] mb-2">
            <Link href="/" className="hover:text-[#12161A]">Home</Link>
            <span>/</span>
            <Link href={`/orders/${order.orderNumber}`} className="hover:text-[#12161A]">
              Order #{order.orderNumber}
            </Link>
            <span>/</span>
            <span className="text-[#12161A] font-medium">Digital Proof Sign-Off</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold text-[#12161A]">
            Digital Prepress Master Proof
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              order.proofStatus === "APPROVED"
                ? "bg-emerald-100 text-emerald-800"
                : order.proofStatus === "REVISION_REQUESTED"
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Proof Status: {order.proofStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-8 flex items-center gap-2">
          <Check size={18} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive Proof Canvas Inspection */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm">
            {/* Viewer Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] text-xs text-[#8C8270]">
              <span className="font-semibold text-[#12161A]">
                Inspection Area (Includes 3mm Bleed & Crop Marks)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.15))}
                  className="p-1 hover:text-black"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="font-mono text-xs">{Math.round(zoomScale * 100)}%</span>
                <button
                  onClick={() => setZoomScale(Math.min(1.8, zoomScale + 0.15))}
                  className="p-1 hover:text-black"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setZoomScale(1)}
                  className="p-1 hover:text-black text-[11px]"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Proof Artwork Display */}
            <div className="py-8 flex items-center justify-center bg-[#F3EFE6] rounded-xl overflow-hidden my-4 border border-[#DCD5C5]">
              <div
                style={{ transform: `scale(${zoomScale})`, transition: "transform 0.2s ease" }}
                className="relative bg-white shadow-2xl p-6 border border-neutral-300"
              >
                {/* Crop marks in corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black" />

                {/* Color swatch bar */}
                <div className="flex gap-1 mb-3 justify-center">
                  <div className="w-4 h-3 bg-cyan-500" />
                  <div className="w-4 h-3 bg-pink-500" />
                  <div className="w-4 h-3 bg-yellow-400" />
                  <div className="w-4 h-3 bg-black" />
                  <div className="w-4 h-3 bg-[#D4AF37]" />
                </div>

                {/* Artwork Content */}
                <div className="w-80 h-48 bg-[#12161A] text-white p-6 flex flex-col justify-between rounded border-2 border-dashed border-red-500/50">
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                      PRINTCRAFT • VAJRA PRINTS
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white mt-1">
                      {order.customerName}
                    </h3>
                    <p className="text-[10px] text-neutral-400 tracking-wider">
                      {firstItem?.productName || "Bespoke Stationery"}
                    </p>
                  </div>
                  <div className="text-center text-[9px] text-[#D4AF37] font-mono">
                    300 DPI MASTER PROOF • CMYK REGISTERED
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="mt-2 text-center text-[8px] font-mono text-neutral-500">
                  REF: {order.orderNumber} • CUT: 89x51mm + 3mm BLEED • SCALE 1:1
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8C8270] pt-2">
              <span className="text-red-700 font-mono">── Red dashed: 3mm Bleed Limit</span>
              <span>Solid edges: Guillotine Cut Trim Line</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prepress Checklist & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#12161A]">
              Prepress Verification Checklist
            </h3>

            <div className="space-y-3 text-xs text-[#5A5346]">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>3mm full bleed safety margin present</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>High resolution 300 DPI vector clarity</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>Foil channel separated for brass stamping plate</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>Spelling and contact coordinates verified</span>
              </div>
            </div>

            {order.proofNotes && (
              <div className="p-3 rounded-lg bg-white border border-[#E8E2D5] text-xs">
                <span className="font-semibold text-[#12161A] block mb-1">Prepress Operator Note:</span>
                <p className="text-[#5A5346]">{order.proofNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[#E8E2D5] space-y-3">
              {order.proofStatus !== "APPROVED" ? (
                <>
                  <button
                    onClick={handleApproveProof}
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check size={16} />
                    <span>{submitting ? "Signing Off..." : "Approve Proof & Authorize Printing"}</span>
                  </button>

                  <button
                    onClick={() => setShowRevisionModal(true)}
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-white text-[#12161A] border border-[#DCD5C5] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#FDFBF7] transition"
                  >
                    Request Prepress Revision
                  </button>
                </>
              ) : (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-xs text-center font-semibold">
                  ✓ Proof is approved and locked. Press run is in progress.
                </div>
              )}

              <Link
                href={`/orders/${order.orderNumber}`}
                className="w-full block text-center text-xs text-[#8C8270] hover:text-[#12161A] pt-2"
              >
                ← Return to Order Summary
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D5]">
            <h3 className="font-serif font-bold text-xl text-[#12161A] mb-2">
              Request Prepress Artwork Revision
            </h3>
            <p className="text-xs text-[#5A5346] mb-4">
              Describe the adjustments needed (e.g. font size, spelling, gold foil position).
              Our prepress operator will update the proof within 2 hours.
            </p>
            <form onSubmit={handleRequestRevision} className="space-y-4">
              <textarea
                rows={4}
                required
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g. Please shift the telephone number 3mm lower and change font to Playfair bold..."
                className="w-full p-3 border border-[#DCD5C5] rounded-lg text-xs text-[#12161A] focus:outline-none focus:border-[#12161A]"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 text-xs text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#12161A] text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition"
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

