import React from "react";
import Link from "next/link";
import { Printer, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-[#12161A] text-[#FDFBF7] border-t border-[#262B30] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Atelier Brand Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#222831] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
                <Printer size={20} />
              </div>
              <div>
                <span className="text-xl font-serif tracking-wider font-semibold text-white">
                  PrintCraft
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Vajra Prints
                </span>
              </div>
            </div>
            <p className="text-sm text-[#A29780] leading-relaxed">
              Prop. Gangadhara / Ganesh. Premier commercial & artisanal printing hub in Cottonpet,
              Bengaluru. Wedding Cards, Customized Envelopes, Laser Engraving & Cutting, Custom Name
              Plates, Visiting Cards, Event Invitations, Certificates, & Brochures.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck size={16} />
              <span>Certified Prepress Calibration & Laser Precision</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4">
              Atelier Services
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A29780]">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Full Print Catalog
                </Link>
              </li>
              <li>
                <Link href="/editor" className="hover:text-white transition">
                  Mini Canva 2D Studio
                </Link>
              </li>
              <li>
                <Link href="/laser-cutting" className="hover:text-white transition">
                  Laser Engraving & Cutting
                </Link>
              </li>
              <li>
                <Link href="/customizer/box" className="hover:text-white transition">
                  Custom Name Plates & Packaging
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] text-white/90 font-medium transition flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#D4AF37]" />
                  <span>Platform Architecture & Team</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Bengaluru Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Staff Prepress Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Print & Fabrication Offerings */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4">
              Signature Offerings
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A29780]">
              <li>Wedding Cards & Customized Envelopes</li>
              <li>Laser Engraving & Sub-Millimeter Cutting</li>
              <li>Custom Name Plates (Gold, Silver, Copper, Pink)</li>
              <li>Luxury Business & Visiting Cards</li>
              <li>Event Invitations & Ceremony Suites</li>
              <li>Official Certificates & Corporate Brochures</li>
            </ul>
          </div>

          {/* Bengaluru Studio & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4">
              Visit Cottonpet Studio
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-[#A29780]">
              <MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                #50, Obbaya Lane, Cottonpet 2nd Cross, Bengaluru - 560053, Karnataka
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#A29780]">
              <Phone size={16} className="text-[#D4AF37] shrink-0" />
              <a href="tel:+919945585603" className="hover:text-white transition font-medium">
                +91 9945585603 (Call & WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#A29780]">
              <Mail size={16} className="text-[#D4AF37] shrink-0" />
              <a href="mailto:vajraprinters3245@gmail.com" className="hover:text-white transition">
                vajraprinters3245@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#827866] pt-1">
              <Clock size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Mon-Sat: 9:00 AM – 9:00 PM | Sunday by Appointment</span>
            </div>
          </div>
        </div>

        {/* Platform Architecture & Engineering Showcase Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#161B21] border border-[#2B323B] shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#262B30]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] mb-2">
                <Sparkles size={13} />
                <span>Proprietary Tech Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                PrintCraft Engine v1.0
              </h3>
              <p className="text-xs text-[#A29780] mt-1 max-w-2xl">
                Bespoke high-performance digital printing platform, real-time 3D WebGL shader customizer,
                and sub-millimeter laser toolpath compiler powering Vajra Prints.
              </p>
            </div>

            <Link
              href="/about"
              className="self-start lg:self-center px-4 py-2 rounded-lg bg-[#222831] hover:bg-[#2A313C] border border-[#3B424D] text-xs font-semibold text-[#D4AF37] transition flex items-center gap-1.5"
            >
              <span>View System Architecture</span>
              <span>→</span>
            </Link>
          </div>

          {/* Core Engineering Leads */}
          <div className="pt-6">
            <span className="text-[10px] uppercase tracking-widest text-[#8C8270] font-semibold block mb-4">
              Platform Architecture & Engineering Team
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ilmaan Khan */}
              <div className="p-4 rounded-xl bg-[#1A1F26] border border-[#2A313C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-white">Ilmaan Khan</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      1CR24IS079
                    </span>
                  </div>
                  <p className="text-xs text-[#D4AF37] font-medium">Lead Architect & Full-Stack Systems</p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#262B30] flex items-center gap-1.5 text-xs text-[#8C8270]">
                  <Mail size={12} className="text-[#D4AF37] shrink-0" />
                  <a
                    href="mailto:ilm2ankhan@gmail.com"
                    className="hover:text-white transition truncate"
                  >
                    ilm2ankhan@gmail.com
                  </a>
                </div>
              </div>

              {/* Manish M */}
              <div className="p-4 rounded-xl bg-[#1A1F26] border border-[#2A313C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-white">Manish M</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      1CR24IS096
                    </span>
                  </div>
                  <p className="text-xs text-[#D4AF37] font-medium">UI/UX & Interactive Design Lead</p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#262B30] flex items-center gap-1.5 text-xs text-[#8C8270]">
                  <Mail size={12} className="text-[#D4AF37] shrink-0" />
                  <a
                    href="mailto:manish.ise24@cmrit.ac.in"
                    className="hover:text-white transition truncate"
                  >
                    manish.ise24@cmrit.ac.in
                  </a>
                </div>
              </div>

              {/* Divyanshu */}
              <div className="p-4 rounded-xl bg-[#1A1F26] border border-[#2A313C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-white">Divyanshu</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      1CR24IS068
                    </span>
                  </div>
                  <p className="text-xs text-[#D4AF37] font-medium">3D Graphics & Prepress Engineer</p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#262B30] flex items-center gap-1.5 text-xs text-[#8C8270]">
                  <Mail size={12} className="text-[#D4AF37] shrink-0" />
                  <a
                    href="mailto:divyanshu.ise24@cmrit.ac.in"
                    className="hover:text-white transition truncate"
                  >
                    divyanshu.ise24@cmrit.ac.in
                  </a>
                </div>
              </div>
            </div>

            {/* Subtle Institutional Partnership Statement */}
            <p className="text-center text-xs text-[#9E9482] mt-5 pt-4 border-t border-[#262B30]/70 font-medium leading-relaxed">
              Engineered in collaboration with the Department of Information Science & Engineering, CMR
              Institute of Technology, Bengaluru for Vajra Prints.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#262B30] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#827866] gap-4">
          <p>© {new Date().getFullYear()} PrintCraft - Vajra Prints. Prop. Gangadhara / Ganesh.</p>
          <div className="flex items-center gap-6">
            <span>Bengaluru - 560053</span>
            <span>Razorpay Secure (UPI, Cards, Netbanking)</span>
            <span>Shiprocket Courier Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
