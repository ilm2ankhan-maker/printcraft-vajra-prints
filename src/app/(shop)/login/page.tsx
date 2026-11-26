"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login, register, currentUser } = useAuthStore();

  const [tab, setTab] = useState<"login" | "register">("login");

  // Login fields
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register fields
  const [regId, setRegId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("+91 ");
  const [regAddress, setRegAddress] = useState("");
  const [regError, setRegError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.replace(redirect);
    }
  }, [currentUser, router, redirect]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your User ID and password.");
      return;
    }
    setLoading(true);
    const result = login(loginId.trim(), loginPassword);
    setLoading(false);
    if (!result.success) {
      setLoginError(result.error || "Login failed.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regId.trim() || !regPassword.trim() || !regName.trim()) {
      setRegError("User ID, password, and full name are required.");
      return;
    }
    setLoading(true);
    const result = register({
      userId: regId.includes("@") ? regId.split("@")[0] : regId,
      fullName: regName,
      email: regId.includes("@") ? regId : `${regId}@printcraft.local`,
      phone: regPhone,
      companyName: "",
      password: regPassword,
      shippingAddress: regAddress,
      city: "",
      pincode: "",
    });
    setLoading(false);
    if (!result.success) {
      setRegError(result.error || "Registration failed.");
    }
  };

  const fillDemo = (userId: string, pw: string) => {
    setLoginId(userId);
    setLoginPassword(pw);
    setLoginError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5EFE6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="text-3xl font-serif tracking-wider font-semibold text-[#12161A]">
              PrintCraft
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">
              Vajra Prints
            </span>
          </Link>
          <p className="mt-3 text-sm text-[#8C8270]">
            {tab === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E8E2D5] overflow-hidden">
          {/* Tab Toggle */}
          <div className="flex border-b border-[#E8E2D5]">
            <button
              onClick={() => { setTab("login"); setLoginError(""); }}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors ${
                tab === "login"
                  ? "text-[#12161A] border-b-2 border-[#D4AF37] bg-[#FDFBF7]"
                  : "text-[#8C8270] hover:text-[#12161A] hover:bg-[#FAFAF8]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("register"); setRegError(""); }}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-colors ${
                tab === "register"
                  ? "text-[#12161A] border-b-2 border-[#D4AF37] bg-[#FDFBF7]"
                  : "text-[#8C8270] hover:text-[#12161A] hover:bg-[#FAFAF8]"
              }`}
            >
              New Account
            </button>
          </div>

          <div className="p-7">
            {/* ─── SIGN IN TAB ─── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Quick demo fills */}
                <div>
                  <p className="text-xs text-[#8C8270] mb-2 font-medium uppercase tracking-wider">
                    Quick Demo Fill
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemo("aarav", "1234")}
                      className="flex-1 text-xs px-3 py-1.5 rounded-full border border-[#D4AF37]/50 bg-amber-50 text-amber-800 hover:bg-amber-100 transition font-medium"
                    >
                      👤 Aarav (aarav / 1234)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemo("priya", "1234")}
                      className="flex-1 text-xs px-3 py-1.5 rounded-full border border-[#D4AF37]/50 bg-amber-50 text-amber-800 hover:bg-amber-100 transition font-medium"
                    >
                      👤 Priya (priya / 1234)
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#E8E2D5]" />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. aarav"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                {loginError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#12161A] text-[#FDFBF7] rounded-lg text-sm font-semibold tracking-wide hover:bg-neutral-800 transition shadow-sm disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>

                <p className="text-center text-xs text-[#8C8270]">
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-[#D4AF37] hover:underline font-medium"
                  >
                    Create one here
                  </button>
                </p>
              </form>
            )}

            {/* ─── REGISTER TAB ─── */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Choose a User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regId}
                    onChange={(e) => setRegId(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    placeholder="e.g. john_doe"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5346] mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Street, City, Pincode"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D6CEBD] bg-[#FDFBF7] text-[#12161A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                {regError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#12161A] text-[#FDFBF7] rounded-lg text-sm font-semibold tracking-wide hover:bg-neutral-800 transition shadow-sm disabled:opacity-60"
                >
                  {loading ? "Creating Account…" : "Create Account & Sign In"}
                </button>

                <p className="text-center text-xs text-[#8C8270]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-[#D4AF37] hover:underline font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#B0A898] mt-6">
          Your login is entirely separate from staff access.{" "}
          <Link href="/" className="hover:text-[#D4AF37] transition">
            Return to store →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
