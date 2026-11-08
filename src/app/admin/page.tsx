"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  FileCheck,
  Truck,
  Check,
  Clock,
  ExternalLink,
  Mail,
  Search,
  Sparkles,
  Scissors,
  Box,
  Layers,
  Lock,
  ShieldCheck,
} from "@/components/ui/icons";
import { OrderRecord } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminIdInput, setAdminIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAdminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const validId = adminIdInput.trim() === "admin" || adminIdInput.trim() === "vajra_admin";
    const validPass = passwordInput === "vajra2026";

    if (validId && validPass) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      setLoading(true);
      fetchOrders();
    } else {
      setAuthError("Invalid credentials. Please verify Staff Admin ID and password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    setAdminIdInput("");
    setPasswordInput("");
    setAuthError("");
  };

  const fetchOrders = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error loading admin orders:", err))
      .finally(() => setLoading(false));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${orderNumber} updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleTriggerProofEmail = async (orderNumber: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, triggerProofEmail: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Proof email dispatched for #${orderNumber}`);
        fetchOrders();
      }
    } catch (err) {
      console.error("Proof email dispatch error:", err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const proofingCount = orders.filter((o) => o.status === "PROOFING").length;
  const printingCount = orders.filter((o) => o.status === "PRINTING").length;
  const finishingCount = orders.filter((o) => o.status === "FINISHING").length;

  // Loading initial authentication state check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  // Not authenticated: Staff Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E2D5] shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#12161A] text-[#D4AF37] flex items-center justify-center shadow-md border border-[#D4AF37]/30 mb-4">
              <Lock size={26} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={13} className="text-amber-600" />
              <span>Vajra Prints • Staff Portal</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#12161A]">Admin Control Center</h2>
            <p className="text-xs text-[#8C8270] mt-1">
              Restricted prepress management & order queue authorization
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1">
                Admin Staff ID
              </label>
              <input
                type="text"
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                placeholder="e.g. admin or vajra_admin"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] bg-[#FDFBF7] text-sm text-[#12161A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCD5C5] bg-[#FDFBF7] text-sm text-[#12161A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#12161A] hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
            >
              <Lock size={14} className="text-[#D4AF37]" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#E8E2D5] pt-4">
            <Link
              href="/"
              className="text-xs text-[#8C8270] hover:text-[#12161A] transition underline"
            >
              ← Return to PrintCraft Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-2">
            <Printer size={14} className="text-[#D4AF37]" />
            <span>Cottonpet Studio Prepress Control Center • Bengaluru</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#12161A]">
            Vajra Prints Pipeline & Proofing Queue
          </h1>
          <p className="text-xs text-[#5A5346] mt-1">
            Prop. Gangadhara / Ganesh • Wedding Cards, Laser Engraving & Name Plates, Certificates, & Shiprocket dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="px-4 py-2.5 bg-white border border-[#DCD5C5] text-[#12161A] rounded-lg text-xs font-semibold hover:bg-[#FDFBF7] transition"
          >
            Open 2D Studio
          </Link>
          <button
            onClick={fetchOrders}
            className="px-4 py-2.5 bg-[#12161A] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition"
          >
            Refresh Pipeline
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5"
            title="Lock and logout of admin panel"
          >
            <Lock size={13} className="text-rose-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8270] block">
            Awaiting Customer Proof
          </span>
          <span className="text-2xl font-serif font-bold text-[#12161A] mt-1 block">
            {proofingCount} Jobs
          </span>
          <span className="text-[10px] text-amber-700">Action: Prepress Verification</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8270] block">
            On Heidelberg Press
          </span>
          <span className="text-2xl font-serif font-bold text-[#12161A] mt-1 block">
            {printingCount} Jobs
          </span>
          <span className="text-[10px] text-blue-700">Digital / Letterpress Pressing</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8270] block">
            Foil & Wax Finishing
          </span>
          <span className="text-2xl font-serif font-bold text-[#12161A] mt-1 block">
            {finishingCount} Jobs
          </span>
          <span className="text-[10px] text-purple-700">Hot Foil Stamping & Cutting</span>
        </div>

        <div className="bg-[#12161A] text-[#FDFBF7] p-5 rounded-xl border border-[#D4AF37]/30 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
            Total Pipeline Revenue
          </span>
          <span className="text-2xl font-serif font-bold text-white mt-1 block">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-[#A29780]">{orders.length} Verified Orders</span>
        </div>
      </div>

      {/* Pipeline Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "PAID", label: "Paid" },
            { id: "PROOFING", label: "Proofing" },
            { id: "PRINTING", label: "Printing" },
            { id: "FINISHING", label: "Finishing" },
            { id: "SHIPPED", label: "Shipped" },
            { id: "DELIVERED", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? "bg-[#12161A] text-white"
                  : "bg-white text-[#5A5346] border border-[#E8E2D5] hover:bg-[#F8F5EE]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8270]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DCD5C5] bg-white focus:outline-none focus:border-[#12161A]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] border-b border-[#E8E2D5] text-[#8C8270] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Print Jobs</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Proof Status</th>
                <th className="py-3 px-4">Production Stage</th>
                <th className="py-3 px-4 text-right">Prepress Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8C8270]">
                    No orders matching selected stage.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F0]/50 transition">
                    {/* Order Number */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="font-serif font-bold text-sm text-[#12161A] hover:text-[#D4AF37] block"
                      >
                        {ord.orderNumber}
                      </Link>
                      <span className="text-[10px] text-[#8C8270]">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#12161A] block">
                        {ord.customerName}
                      </span>
                      <span className="text-[11px] text-[#736A58] block">
                        {ord.customerPhone}
                      </span>
                      <span className="text-[10px] text-[#8C8270]">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {ord.items.map((it, i) => (
                        <div key={i} className="mb-1">
                          <span className="font-medium text-[#12161A] block">
                            {it.quantity}x {it.productName}
                          </span>
                          {it.selectedOptions && (
                            <span className="text-[10px] text-[#8C8270] block truncate">
                              {Object.entries(it.selectedOptions)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" | ")}
                            </span>
                          )}
                        </div>
                      ))}
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#12161A]">
                      ₹{ord.totalAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Proof Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.proofStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.proofStatus === "REVISION_REQUESTED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ord.proofStatus.replace("_", " ")}
                      </span>
                      {ord.proofNotes && (
                        <span className="block text-[9px] text-[#8C8270] mt-0.5 truncate max-w-[140px]" title={ord.proofNotes}>
                          {ord.proofNotes}
                        </span>
                      )}
                    </td>

                    {/* Pipeline Stage Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.orderNumber, e.target.value)}
                        className="px-2 py-1 rounded border border-[#DCD5C5] text-xs font-semibold bg-white text-[#12161A]"
                      >
                        <option value="PLACED">Placed</option>
                        <option value="PAID">Paid</option>
                        <option value="PROOFING">Proofing</option>
                        <option value="PRINTING">Printing</option>
                        <option value="FINISHING">Finishing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleTriggerProofEmail(ord.orderNumber)}
                        title="Send Proof Email to Customer"
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded text-[11px] font-medium"
                      >
                        Email Proof
                      </button>

                      <Link
                        href={`/orders/${ord.orderNumber}/proof`}
                        className="px-2.5 py-1 bg-[#12161A] text-white rounded text-[11px] font-semibold hover:bg-neutral-800 inline-block"
                      >
                        Inspect Proof
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

