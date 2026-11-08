"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Printer,
  ShoppingBag,
  Sparkles,
  Layers,
  Box,
  Scissors,
  Phone,
  ShieldCheck,
  Lock,
} from "./icons";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItemsCount = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Print Catalog", href: "/products" },
    { label: "2D Design Studio", href: "/editor", highlight: true },
    { label: "3D Custom Box", href: "/customizer/box" },
    { label: "Laser Cutting", href: "/laser-cutting" },
    { label: "Contact Atelier", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#E8E2D5] transition-all">
      {/* Top Banner with Shop Operating Status */}
      <div className="bg-[#12161A] text-[#E8E2D5] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cottonpet Studio Open: 9:00 AM - 9:00 PM | Bengaluru</span>
            <span className="hidden md:inline text-neutral-500">|</span>
            <span className="hidden md:inline text-[#D4AF37]">
              Prop: Gangadhara / Ganesh • Wedding Cards, Laser Engraving & Name Plates
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+919945585603"
              className="hover:text-amber-300 flex items-center gap-1 transition"
            >
              <Phone size={12} />
              <span>+91 9945585603</span>
            </a>
            <Link
              href="/admin"
              className="bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 transition-all font-medium hover:text-amber-400"
            >
              <Lock size={12} className="text-amber-500" />
              <span>Staff Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Atelier Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[#12161A] text-[#FDFBF7] flex items-center justify-center shadow-md border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition">
              <Printer size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-2xl font-serif tracking-wider font-semibold text-[#12161A]">
                PrintCraft
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8270] font-sans -mt-1 font-semibold text-[#D4AF37]">
                Vajra Prints
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#12161A] bg-[#ECE6D8]/80 font-semibold"
                      : "text-[#5A5346] hover:text-[#12161A] hover:bg-[#F3EFE6]"
                  } ${link.highlight ? "text-amber-800 font-semibold" : ""}`}
                >
                  {link.highlight && <Sparkles size={14} className="text-[#D4AF37]" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Cart & Studio Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/editor"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-[#12161A] text-[#FDFBF7] rounded-md hover:bg-neutral-800 transition shadow-sm border border-[#D4AF37]/50"
            >
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span>Open Studio</span>
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-md hover:bg-[#ECE6D8] text-[#12161A] transition"
              aria-label="View Cart"
            >
              <ShoppingBag size={22} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#12161A] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md lg:hidden text-neutral-700 hover:bg-[#ECE6D8]"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E2D5] py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#12161A] hover:bg-[#ECE6D8]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 font-medium hover:bg-amber-50 rounded-md"
            >
              <Lock size={14} className="text-amber-600" />
              <span>Staff Order Queue & Dashboard</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

