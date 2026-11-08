"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS, Product } from "@/lib/mockData";
import {
  Sparkles,
  ChevronRight,
  Box,
  Scissors,
  Check,
  Search,
} from "@/components/ui/icons";

export default function ProductsCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { label: "All Offerings", value: "ALL" },
    { label: "Wedding Cards & Envelopes", value: "WEDDING_CARD" },
    { label: "Laser & Name Plates", value: "LASER_CUTTING" },
    { label: "Visiting Cards", value: "VISITING_CARD" },
    { label: "Certificates & Brochures", value: "BOOK_COVER" },
    { label: "3D Packaging Boxes", value: "CUSTOM_BOX" },
  ];

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>Vajra Prints Catalog · Cottonpet, Bengaluru</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#12161A] tracking-tight">
          Wedding Cards, Laser Engraving & Name Plates
        </h1>
        <p className="mt-3 text-base text-[#5A5346] leading-relaxed">
          Prop. Gangadhara / Ganesh. Browse our offerings for Wedding Cards & Customized Envelopes,
          Laser Engraving & Cutting, Custom Name Plates (Gold, Silver, Copper, Pink),
          Visiting Cards, Event Invitations, Certificates, & Brochures.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E2D5]">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? "bg-[#12161A] text-[#FDFBF7] shadow-sm font-semibold"
                  : "bg-[#F3EFE6] text-[#5A5346] hover:bg-[#ECE6D8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8270]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search print products..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#DCD5C5] text-xs focus:outline-none focus:border-[#12161A] bg-white"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="card-luxury rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden relative group">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#12161A]/85 text-[#FDFBF7] text-[11px] font-medium backdrop-blur-sm">
                  Starting ₹{prod.basePrice}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-white/90 text-[#12161A] text-[11px] font-semibold backdrop-blur-sm">
                  {prod.specs.widthMm} x {prod.specs.heightMm} mm
                </span>
              </div>

              <div className="p-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8270]">
                  {prod.category.replace("_", " ")}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#12161A] mt-1">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="hover:text-[#8C8270] transition"
                  >
                    {prod.name}
                  </Link>
                </h3>
                <p className="text-xs text-[#5A5346] mt-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Key Options Available */}
                <div className="mt-4 pt-3 border-t border-[#E8E2D5]/70 space-y-1.5 text-xs text-[#736A58]">
                  {prod.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-1.5">
                      <Check size={14} className="text-[#D4AF37]" />
                      <span>
                        <strong>{opt.name}:</strong>{" "}
                        {opt.choices.map((c) => c.label).slice(0, 3).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-[#E8E2D5]/70 mt-4">
              <Link
                href={`/products/${prod.slug}`}
                className="text-xs font-semibold text-[#5A5346] hover:text-[#12161A] transition"
              >
                Full Specs & Pricing
              </Link>

              {prod.isLaserCut ? (
                <Link
                  href="/laser-cutting"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12161A] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  <Scissors size={14} />
                  <span>Configure Laser</span>
                </Link>
              ) : prod.category === "CUSTOM_BOX" ? (
                <Link
                  href="/customizer/box"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12161A] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  <Box size={14} />
                  <span>3D Wrapper</span>
                </Link>
              ) : (
                <Link
                  href={`/editor?category=${prod.category}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12161A] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
                >
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  <span>Design in Studio</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

