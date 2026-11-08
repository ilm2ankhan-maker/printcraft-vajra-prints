"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Box3DCustomizer = dynamic(
  () => import("@/components/customizer/Box3DCustomizer"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin mb-4" />
        <span className="text-sm font-serif text-[#12161A]">
          Loading PrintCraft 3D Packaging & Name Plate Renderer...
        </span>
      </div>
    ),
  }
);

export default function CustomizerBoxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Box3DCustomizer />
    </Suspense>
  );
}

