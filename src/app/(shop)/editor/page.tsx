"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Dynamic import with SSR disabled for Fabric.js
const FabricEditor = dynamic(
  () => import("@/components/editor/FabricEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin mb-4" />
        <span className="text-sm font-serif text-[#12161A]">
          Loading PrintCraft 2D Prepress Canvas (Vajra Prints)...
        </span>
      </div>
    ),
  }
);

function EditorContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as any;
  const templateIdParam = searchParams.get("templateId") || undefined;

  const validCategories = [
    "VISITING_CARD",
    "STICKER",
    "BOOK_COVER",
    "WEDDING_CARD",
    "ENVELOPE",
    "NAME_PLATE",
    "CERTIFICATE",
  ];

  const initialCat = validCategories.includes(categoryParam)
    ? categoryParam
    : "VISITING_CARD";

  return <FabricEditor initialCategory={initialCat} initialTemplateId={templateIdParam} />;
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}

