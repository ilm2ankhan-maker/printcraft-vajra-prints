import React from "react";
import Link from "next/link";
import {
  Printer,
  ShieldCheck,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Layers,
  Box,
  Scissors,
} from "@/components/ui/icons";

export default function AboutPage() {
  const team = [
    {
      name: "Ilmaan Khan",
      role: "Lead Architect & Full-Stack Systems",
      email: "ilm2ankhan@gmail.com",
      usn: "1CR24IS079",
      focus: "App Router, State Orchestration, Micro-services & Cloud Sync",
    },
    {
      name: "Manish M",
      role: "UI/UX & Interactive Design Lead",
      email: "manish.ise24@cmrit.ac.in",
      usn: "1CR24IS096",
      focus: "Design Systems, Fabric.js Vector Canvas & Responsive UX",
    },
    {
      name: "Divyanshu",
      role: "3D Graphics & Prepress Engineer",
      email: "divyanshu.ise24@cmrit.ac.in",
      usn: "1CR24IS068",
      focus: "Three.js / R3F Shaders, Laser Geometry & PDF-lib Engine",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A]">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span>Digital Engineering Showcase • Vajra Prints</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#12161A] tracking-tight">
            PrintCraft Engine v1.0
          </h1>
          <p className="max-w-2xl mx-auto text-base text-[#5A5346] leading-relaxed">
            The next-generation bespoke printing, 3D product simulation, and digital prepress
            platform powering the operations of Vajra Prints, Cottonpet, Bengaluru.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EE] border border-[#E8E2D5] flex items-center justify-center text-[#D4AF37]">
              <Layers size={20} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#12161A]">Interactive 2D Fabric Studio</h3>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              In-browser vector typesetting, graphic overlay, and instant 300 DPI print-ready PDF
              export with 3mm commercial bleed marks.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EE] border border-[#E8E2D5] flex items-center justify-center text-[#D4AF37]">
              <Box size={20} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#12161A]">Photorealistic 3D Simulation</h3>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              Real-time WebGL rendering with Drei shaders simulating metallic gold foil hot-stamping,
              kraft textures, and structural rigidity.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EE] border border-[#E8E2D5] flex items-center justify-center text-[#D4AF37]">
              <Scissors size={20} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#12161A]">Precision Laser Cutting Engine</h3>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              Algorithmic SVG path length extraction with dynamic material area costing for acrylic,
              wood, and anodized name plate sheets.
            </p>
          </div>
        </div>

        {/* Platform Architecture & Engineering Team */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Core Systems Team
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#12161A]">
              Platform Architecture & Engineering Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl border border-[#E8E2D5] p-6 shadow-sm hover:border-[#D4AF37] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#12161A]/5 text-[#5A5346] border border-[#12161A]/10">
                      {member.usn}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#12161A]">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#D4AF37] mt-0.5 mb-2">{member.role}</p>
                  <p className="text-xs text-[#5A5346] leading-relaxed mb-4">{member.focus}</p>
                </div>
                <div className="pt-4 border-t border-[#F0EBE0] flex items-center gap-2 text-xs text-[#8C8270]">
                  <Mail size={13} className="text-[#D4AF37] shrink-0" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-[#12161A] transition truncate font-medium"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Partnership Citation */}
        <div className="bg-[#12161A] text-[#FDFBF7] rounded-2xl p-8 border border-[#262B30] text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Institutional Collaboration</span>
          </div>
          <p className="text-sm md:text-base text-[#DCD5C5] max-w-3xl mx-auto leading-relaxed">
            Engineered in collaboration with the Department of Information Science & Engineering,
            CMR Institute of Technology, Bengaluru for Vajra Prints.
          </p>
          <p className="text-xs text-[#827866] pt-2">
            Vajra Prints • Cottonpet 2nd Cross, Bengaluru - 560053 • Prop. Gangadhara / Ganesh
          </p>
        </div>

        {/* Navigation Action */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#12161A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition shadow-md"
          >
            <span>Explore PrintCraft Atelier</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

