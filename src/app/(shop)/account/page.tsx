"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  status: string;
  proofStatus: string;
  totalAmount: number;
  currency: string;
  items: Array<{ productName: string; quantity: number; totalPrice: number }>;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROOFING: "bg-amber-50 text-amber-700 border-amber-200",
  PRINTING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  FINISHING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, updateProfile, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.replace("/login?redirect=/account");
    }
  }, [mounted, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName);
      setEditPhone(currentUser.phone);
      setEditAddress(currentUser.shippingAddress);
      setEditCity(currentUser.city);
      setEditPincode(currentUser.pincode);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    setLoadingOrders(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.orders) {
          const mine: OrderRecord[] = data.orders.filter(
            (o: OrderRecord) =>
              (currentUser.id && o.userId === currentUser.id) ||
              o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
          );
          mine.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(mine);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [currentUser]);

  const handleSaveProfile = () => {
    setSaving(true);
    updateProfile({
      fullName: editName,
      phone: editPhone,
      shippingAddress: editAddress,
      city: editCity,
      pincode: editPincode,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = currentUser.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5EFE6] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-[#12161A]">
              Welcome, {firstName} 👋
            </h1>
            <p className="text-sm text-[#8C8270] mt-0.5">
              Manage your profile and track your PrintCraft orders
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#FDFBF7]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5A5346]">
              Your Profile
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-[#D4AF37] font-semibold hover:underline"
              >
                Edit Details
              </button>
            )}
          </div>

          <div className="p-6">
            {!editing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C8270] font-semibold">
                    Full Name
                  </span>
                  <p className="mt-0.5 text-[#12161A] font-medium">{currentUser.fullName}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C8270] font-semibold">
                    User ID / Email
                  </span>
                  <p className="mt-0.5 text-[#12161A] font-medium">{currentUser.email}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C8270] font-semibold">
                    Phone
                  </span>
                  <p className="mt-0.5 text-[#12161A]">{currentUser.phone || "—"}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8C8270] font-semibold">
                    Delivery Address
                  </span>
                  <p className="mt-0.5 text-[#12161A]">
                    {currentUser.shippingAddress
                      ? `${currentUser.shippingAddress}${currentUser.city ? `, ${currentUser.city}` : ""}${currentUser.pincode ? ` - ${currentUser.pincode}` : ""}`
                      : "—"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", val: editName, set: setEditName, type: "text" },
                    { label: "Phone", val: editPhone, set: setEditPhone, type: "tel" },
                    { label: "Street Address", val: editAddress, set: setEditAddress, type: "text" },
                    { label: "City", val: editCity, set: setEditCity, type: "text" },
                    { label: "Pincode", val: editPincode, set: setEditPincode, type: "text" },
                  ].map(({ label, val, set, type }) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-sm text-[#12161A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-5 py-2 bg-[#12161A] text-[#FDFBF7] rounded-lg text-sm font-semibold hover:bg-neutral-800 transition disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2 border border-[#D6CEBD] text-[#5A5346] rounded-lg text-sm font-semibold hover:bg-[#F5EFE6] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8E2D5] bg-[#FDFBF7]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5A5346]">
              Your Order History
            </h2>
          </div>

          <div className="p-6">
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-[#8C8270] font-medium">No orders yet.</p>
                <p className="text-sm text-[#B0A898] mt-1 mb-4">
                  Browse our catalog and place your first print order!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12161A] text-[#FDFBF7] rounded-lg text-sm font-semibold hover:bg-neutral-800 transition"
                >
                  Shop Print Catalog →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusStyle =
                    STATUS_STYLES[order.status] || "bg-gray-50 text-gray-600 border-gray-200";
                  return (
                    <div
                      key={order.id}
                      className="border border-[#E8E2D5] rounded-xl p-4 hover:border-[#D4AF37]/50 transition"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#12161A] font-mono">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#8C8270] mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <div className="mt-2 space-y-0.5">
                            {order.items.map((item, i) => (
                              <p key={i} className="text-xs text-[#5A5346]">
                                {item.productName} × {item.quantity} —{" "}
                                <span className="font-semibold">
                                  ₹{item.totalPrice.toLocaleString("en-IN")}
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-base font-bold text-[#12161A]">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </span>
                          <div className="flex gap-2 flex-wrap justify-end">
                            <Link
                              href={`/orders/${order.orderNumber}`}
                              className="text-xs px-3 py-1.5 rounded-lg border border-[#D6CEBD] text-[#5A5346] hover:bg-[#F5EFE6] transition font-medium"
                            >
                              Track Order
                            </Link>
                            <Link
                              href={`/orders/${order.orderNumber}/proof`}
                              className="text-xs px-3 py-1.5 rounded-lg border border-[#D4AF37]/60 bg-amber-50 text-amber-800 hover:bg-amber-100 transition font-medium"
                            >
                              View Proof
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex gap-4 justify-center text-xs text-[#B0A898] pb-6">
          <Link href="/" className="hover:text-[#D4AF37] transition">
            ← Back to Store
          </Link>
          <span>·</span>
          <Link href="/products" className="hover:text-[#D4AF37] transition">
            Print Catalog
          </Link>
          <span>·</span>
          <Link href="/editor" className="hover:text-[#D4AF37] transition">
            Design Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
