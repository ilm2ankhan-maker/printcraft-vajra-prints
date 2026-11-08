"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Printer,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
} from "@/components/ui/icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "wedding_cards",
    quantity: "250",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>Vajra Prints · Direct Studio Consultation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#12161A] tracking-tight">
          Connect with PrintCraft (Vajra Prints)
        </h1>
        <p className="mt-4 text-base text-[#5A5346] leading-relaxed">
          Prop. <strong>Gangadhara / Ganesh</strong>. Whether you need royal wedding cards, customized
          envelopes, laser engraving & cutting, custom name plates (Gold, Silver, Copper, Pink),
          visiting cards, event invitations, certificates, or brochures, our Cottonpet studio team is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-[#E5DEC9] shadow-lg">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#12161A]">
                Inquiry Received by Vajra Prints Desk
              </h2>
              <p className="text-sm text-[#5A5346] max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Gangadhara / Ganesh will review your
                requirements and connect via <strong>{formData.phone || formData.email}</strong> promptly.
              </p>
              <div className="pt-4">
                <a
                  href={`https://wa.me/919945585603?text=Hello%20Vajra%20Prints,%20I%20just%20submitted%20an%20inquiry%20for%20${formData.inquiryType}%20under%20the%20name%20${encodeURIComponent(formData.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#12161A] text-[#FDFBF7] text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition shadow-md"
                >
                  <span>Chat Instantly on WhatsApp (+91 9945585603)</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-[#12161A] border-b border-[#E8E2D5] pb-3">
                Send Project Brief / Custom Quote Request
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Karthik Gowda"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99455 85603"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                    Product Offering
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                  >
                    <option value="wedding_cards">Wedding Cards & Customized Envelopes</option>
                    <option value="name_plates">Custom Name Plates (Gold, Silver, Copper, Pink)</option>
                    <option value="laser_cutting">Laser Engraving & Sub-Millimeter Cutting</option>
                    <option value="visiting_cards">Visiting Cards & Business Stationery</option>
                    <option value="certificates">Event Invitations, Certificates & Brochures</option>
                    <option value="custom_boxes">Custom Rigid Sweet & Gift Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 250 units"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12161A] uppercase tracking-wider mb-1.5">
                  Project Details / Custom Specifications
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding name plate finish (Gold/Silver/Copper/Pink), Kannada or English wedding card text, foiling, or paper stocks..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#12161A] bg-[#FDFBF7]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md border border-[#D4AF37]/50"
              >
                {loading ? (
                  <span>Sending inquiry to Vajra Prints...</span>
                ) : (
                  <>
                    <Sparkles size={16} className="text-[#D4AF37]" />
                    <span>Submit Inquiry to Gangadhara / Ganesh</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Studio Location & Direct Contacts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Studio Address Card */}
          <div className="bg-[#12161A] text-[#FDFBF7] p-8 rounded-2xl border border-[#D4AF37]/40 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Bengaluru Printing Hub
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                PrintCraft – Vajra Prints
              </h3>
              <p className="text-xs text-[#A29780] mt-1">
                Proprietor: Gangadhara / Ganesh
              </p>
            </div>

            <div className="space-y-4 text-sm text-[#D5CEBF]">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#D4AF37] shrink-0 mt-1" />
                <span>
                  <strong>Vajra Prints Studio</strong><br />
                  #50, Obbaya Lane, Cottonpet 2nd Cross,<br />
                  Bengaluru - 560053, Karnataka, India
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4AF37] shrink-0" />
                <div>
                  <a href="tel:+919945585603" className="hover:text-white block font-medium">
                    +91 9945585603 (Call & WhatsApp)
                  </a>
                  <span className="text-xs text-[#A29780] block">
                    Contact: Gangadhara / Ganesh
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4AF37] shrink-0" />
                <a href="mailto:vajraprinters3245@gmail.com" className="hover:text-white">
                  vajraprinters3245@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#262B30]">
                <Clock size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Operating Hours:</span>
                  <span>Monday to Saturday: 9:00 AM – 9:00 PM</span>
                  <span className="block text-xs text-[#A29780]">Sunday: Open by appointment</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://wa.me/919945585603?text=Hello%20Vajra%20Prints,%20I%20would%20like%20to%20inquire%20about%20printing%20services."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center transition"
              >
                Chat on WhatsApp (+91 9945585603)
              </a>
              <a
                href="https://maps.google.com/?q=Cottonpet+Bengaluru+560053"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline pt-1"
              >
                <span>View Cottonpet Location on Google Maps</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Academic Attribution Card */}
          <div className="card-luxury p-6 rounded-2xl space-y-2.5">
            <h4 className="font-serif font-semibold text-[#12161A] text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <span>CMRIT ISE Mini Project</span>
            </h4>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              Developed for <strong>Vajra Prints</strong> by <strong>Manish M (1CR24IS096)</strong>,{" "}
              <strong>Ilmaan Khan (1CR24IS079)</strong>, and <strong>Divyanshu (1CR24IS068)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
