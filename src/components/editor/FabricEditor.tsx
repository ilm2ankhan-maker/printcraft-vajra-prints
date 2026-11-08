"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Check,
  ShoppingBag,
  Sliders,
  Box,
} from "@/components/ui/icons";
import { ATELIER_TEMPLATES, DesignTemplate } from "./templates";
import { CATEGORY_DEFAULTS, useDesignStore } from "@/store/useDesignStore";
import { useCartStore } from "@/store/useCartStore";
import { generatePrintReadyPdf } from "@/lib/pdfExport";

export default function FabricEditor({
  initialCategory = "VISITING_CARD",
  initialTemplateId,
}: {
  initialCategory?:
    | "VISITING_CARD"
    | "STICKER"
    | "BOOK_COVER"
    | "WEDDING_CARD"
    | "ENVELOPE"
    | "NAME_PLATE"
    | "CERTIFICATE";
  initialTemplateId?: string;
}) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const [activeCategory, setActiveCategory] = useState<
    | "VISITING_CARD"
    | "STICKER"
    | "BOOK_COVER"
    | "WEDDING_CARD"
    | "ENVELOPE"
    | "NAME_PLATE"
    | "CERTIFICATE"
    | "BOOK_COVER"
  >(initialCategory);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"TEMPLATES" | "ELEMENTS">("TEMPLATES");
  const [templateFilter, setTemplateFilter] = useState<string>("ALL");
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null);
  const [selectedColor, setSelectedColor] = useState("#12161A");
  const [selectedFont, setSelectedFont] = useState("Playfair Display");
  const [fontSize, setFontSize] = useState(18);
  const [showGuides, setShowGuides] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    dimensionsMm,
    setCategory,
    setBoxTextureUrl,
  } = useDesignStore();

  const addItemToCart = useCartStore((state) => state.addItem);

  // Canvas pixel dimensions based on product category aspect ratio
  const getCanvasDimensions = (cat: typeof activeCategory) => {
    switch (cat) {
      case "VISITING_CARD":
        return { width: 504, height: 289 }; // 89x51mm approx
      case "STICKER":
        return { width: 400, height: 400 }; // Square
      case "WEDDING_CARD":
        return { width: 380, height: 532 }; // 5x7 in
      case "ENVELOPE":
        return { width: 550, height: 400 };
      case "NAME_PLATE":
        return { width: 550, height: 260 };
      case "CERTIFICATE":
        return { width: 560, height: 396 };
      case "BOOK_COVER":
        return { width: 420, height: 594 }; // A5
      default:
        return { width: 504, height: 289 };
    }
  };

  const canvasDims = getCanvasDimensions(activeCategory);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    // Dispose old canvas if category changes
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: canvasDims.width,
      height: canvasDims.height,
      backgroundColor: "#FDFBF7",
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Selection event listeners
    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0] || null;
      setSelectedObject(obj);
      if (obj && (obj instanceof fabric.IText || obj instanceof fabric.FabricText)) {
        setFontSize((obj as any).fontSize || 18);
        setSelectedColor((obj as any).fill || "#12161A");
      }
    });

    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0] || null;
      setSelectedObject(obj);
      if (obj && (obj instanceof fabric.IText || obj instanceof fabric.FabricText)) {
        setFontSize((obj as any).fontSize || 18);
        setSelectedColor((obj as any).fill || "#12161A");
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Load requested template or initial default template for this category
    const initialTmpl = initialTemplateId
      ? ATELIER_TEMPLATES.find((t) => t.id === initialTemplateId)
      : null;

    const targetTemplate = initialTmpl || ATELIER_TEMPLATES.find((t) => t.category === activeCategory);
    if (targetTemplate) {
      loadTemplate(targetTemplate, canvas);
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [activeCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add text element
  const addText = (textType: "heading" | "subheading" | "body") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let textContent = "Atelier Headline";
    let size = 24;
    let weight = "bold";
    let font = "Playfair Display";

    if (textType === "subheading") {
      textContent = "FINE ART PRINTMAKERS";
      size = 12;
      weight = "normal";
      font = "Plus Jakarta Sans";
    } else if (textType === "body") {
      textContent = "Cottonpet, Bengaluru 560053\n+91 9945585603";
      size = 10;
      weight = "normal";
      font = "Plus Jakarta Sans";
    }

    const text = new fabric.IText(textContent, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      fill: selectedColor,
      textAlign: "center",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    showToast("Text layer added");
  };

  // Add geometric shapes
  const addShape = (shapeType: "rect" | "circle" | "gold_border") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (shapeType === "rect") {
      const rect = new fabric.Rect({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        width: 100,
        height: 60,
        fill: selectedColor,
        rx: 4,
        ry: 4,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    } else if (shapeType === "circle") {
      const circle = new fabric.Circle({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        radius: 40,
        fill: selectedColor,
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
    } else if (shapeType === "gold_border") {
      const border = new fabric.Rect({
        left: 15,
        top: 15,
        width: canvas.getWidth() - 30,
        height: canvas.getHeight() - 30,
        fill: "transparent",
        stroke: "#D4AF37",
        strokeWidth: 1.5,
        selectable: true,
      });
      canvas.add(border);
      canvas.setActiveObject(border);
    }

    canvas.renderAll();
    showToast("Shape layer added");
  };

  // Upload user image/logo
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const canvas = fabricCanvasRef.current;
      if (!canvas || !dataUrl) return;

      try {
        const img = await fabric.FabricImage.fromURL(dataUrl);
        // Scale down to fit gracefully inside canvas
        const maxWidth = canvas.getWidth() * 0.4;
        if (img.width && img.width > maxWidth) {
          img.scaleToWidth(maxWidth);
        }
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        showToast("Logo / image imported successfully");
      } catch (err) {
        console.error("Error loading image onto canvas:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete selected object
  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    setSelectedObject(null);
    canvas.renderAll();
    showToast("Selected layer deleted");
  };

  // Layer ordering
  const bringForward = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    canvas.bringObjectForward(selectedObject);
    canvas.renderAll();
  };

  const sendBackward = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    canvas.sendObjectBackwards(selectedObject);
    canvas.renderAll();
  };

  // Text property updates
  const updateTextColor = (color: string) => {
    setSelectedColor(color);
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    selectedObject.set("fill", color);
    canvas.renderAll();
  };

  const updateFontFamily = (font: string) => {
    setSelectedFont(font);
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    (selectedObject as any).set("fontFamily", font);
    canvas.renderAll();
  };

  const updateFontSize = (size: number) => {
    setFontSize(size);
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedObject) return;
    (selectedObject as any).set("fontSize", size);
    canvas.renderAll();
  };

  // Reset to Blank Canvas
  const handleBlankCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";
    canvas.renderAll();
    setSelectedObject(null);
    showToast("Clean blank canvas loaded. Default prepress guide margins active.");
  };

  // Load a pre-designed template
  const loadTemplate = (tmpl: DesignTemplate, targetCanvas?: fabric.Canvas) => {
    const canvas = targetCanvas || fabricCanvasRef.current;
    if (!canvas) return;

    // Cleanly clear existing objects and reset active state
    canvas.discardActiveObject();
    canvas.clear();
    canvas.backgroundColor = tmpl.thumbnailColor || "#FDFBF7";

    tmpl.canvasObjects.forEach((objDef: any) => {
      if (!objDef || typeof objDef !== "object") return;

      let obj: fabric.FabricObject | null = null;
      const { type, text, ...options } = objDef;

      // Filter out invalid/malformed shapes lacking valid width/height/radius
      if (type === "Rect" || type === "rect") {
        if (typeof options.width === "number" && typeof options.height === "number") {
          obj = new fabric.Rect(options);
        }
      } else if (type === "Circle" || type === "circle") {
        if (typeof options.radius === "number" && options.radius > 0) {
          obj = new fabric.Circle(options);
        }
      } else if (type === "IText" || type === "FabricText" || type === "text") {
        const textContent = text || options.text || "Text";
        obj = new fabric.IText(textContent, options);
      }

      if (obj) {
        canvas.add(obj);
      }
    });

    if (tmpl.category && tmpl.category !== activeCategory) {
      setActiveCategory(tmpl.category as any);
      setCategory(tmpl.category as any);
    }

    canvas.renderAll();
    showToast(`Loaded template: ${tmpl.name}`);
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out" | "reset") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let newZoom = zoomLevel;
    if (direction === "in") newZoom = Math.min(2.5, zoomLevel + 0.2);
    else if (direction === "out") newZoom = Math.max(0.5, zoomLevel - 0.2);
    else newZoom = 1;

    setZoomLevel(newZoom);
    canvas.setZoom(newZoom);
    canvas.renderAll();
  };

  // Export 300 DPI Print PDF with Bleed
  const handleExportPdf = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    showToast("Rendering 300 DPI print-ready PDF with bleed...");

    try {
      // Export high-res canvas at 3x multiplier
      const dataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 3,
      });

      const dims = CATEGORY_DEFAULTS[activeCategory] || {
        width: 89,
        height: 51,
        bleed: 3.0,
      };

      const pdfBytes = await generatePrintReadyPdf({
        title: `PrintCraft ${activeCategory} - Vajra Prints`,
        categoryName: activeCategory,
        widthMm: dims.width,
        heightMm: dims.height,
        bleedMm: dims.bleed,
        dpi: 300,
        dataUrl,
      });

      // Prompt browser download
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PrintCraft_VajraPrints_${activeCategory}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("✓ 300 DPI Print Master PDF downloaded!");
    } catch (err) {
      console.error("Export error:", err);
      showToast("PDF Export failed, please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Push Canvas to 3D Box Texture
  const handleSyncTo3DBox = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 2,
    });

    setBoxTextureUrl(dataUrl);
    showToast("✓ Design synced to 3D Custom Box Wrapper!");
  };

  // Add Customized Design to Cart
  const handleAddToCart = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const previewUrl = canvas.toDataURL({ format: "png", multiplier: 1.5 });
    const dims = CATEGORY_DEFAULTS[activeCategory];

    addItemToCart({
      productId: `prod_custom_${activeCategory.toLowerCase()}`,
      productName: `Custom Bespoke ${activeCategory.replace("_", " ")}`,
      productImage: previewUrl,
      category: activeCategory,
      quantity: 100,
      unitPrice: 8.5,
      totalPrice: 850,
      selectedOptions: {
        paper: "cotton_400",
        finish: "custom_design",
      },
      designSnapshot: {
        previewUrl,
        widthMm: dims.width,
        heightMm: dims.height,
        title: `Custom ${activeCategory}`,
      },
    });

    showToast("✓ Custom design added to your cart!");
  };

  const templatesForCategory = ATELIER_TEMPLATES.filter(
    (t) => t.category === activeCategory
  );

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden flex flex-col lg:flex-row bg-[#F5F2EB] border-t border-[#E5DEC9]">
      {/* Left Sidebar: Tools & Template Library */}
      <div className="w-full lg:w-88 bg-white border-r border-[#E8E2D5] flex flex-col justify-between overflow-hidden shrink-0">
        {/* Sidebar Tabs: Templates vs Elements */}
        <div className="flex border-b border-[#E8E2D5] bg-[#FDFBF7] shrink-0">
          <button
            onClick={() => setActiveSidebarTab("TEMPLATES")}
            className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
              activeSidebarTab === "TEMPLATES"
                ? "border-b-2 border-[#12161A] text-[#12161A] bg-white"
                : "text-[#8C8270] hover:text-[#12161A]"
            }`}
          >
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setActiveSidebarTab("ELEMENTS")}
            className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
              activeSidebarTab === "ELEMENTS"
                ? "border-b-2 border-[#12161A] text-[#12161A] bg-white"
                : "text-[#8C8270] hover:text-[#12161A]"
            }`}
          >
            <Layers size={14} className="text-[#D4AF37]" />
            <span>Elements & Tools</span>
          </button>
        </div>

        {/* Tab 1: Templates Catalog */}
        {activeSidebarTab === "TEMPLATES" ? (
          <div className="p-4 flex flex-col flex-1 max-h-[calc(100vh-180px)] overflow-hidden">
            {/* Sticky Template Category Filter Pills */}
            <div className="sticky top-0 bg-white z-10 pb-2 border-b border-gray-100 shrink-0">
              <span className="text-[11px] font-bold text-[#8C8270] uppercase tracking-wider block mb-2">
                Browse By Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "All Templates", value: "ALL" },
                  { label: "Wedding", value: "WEDDING_CARD" },
                  { label: "Visiting Cards", value: "VISITING_CARD" },
                  { label: "Name Plates", value: "NAME_PLATE" },
                  { label: "Certificates", value: "CERTIFICATE" },
                  { label: "Envelopes", value: "ENVELOPE" },
                  { label: "Stickers", value: "STICKER" },
                ].map((pill) => (
                  <button
                    key={pill.value}
                    onClick={() => setTemplateFilter(pill.value)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                      templateFilter === pill.value
                        ? "bg-[#12161A] text-white"
                        : "bg-[#F8F5EE] border border-[#E8E2D5] text-[#5A5346] hover:bg-[#ECE6D8]"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards Grid with dedicated internal scroll */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1 custom-scrollbar">
              {/* Primary Blank Canvas / Start from Scratch Option */}
              <div
                onClick={handleBlankCanvas}
                className="group p-3 rounded-xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-amber-50/40 hover:bg-amber-50/80 transition cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-[#D4AF37]/50 shrink-0 flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform">
                  <Square size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-serif font-bold text-xs text-[#12161A] truncate group-hover:text-[#B38F4D] transition">
                      Blank Canvas / Start from Scratch
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#12161A] text-[#D4AF37] shrink-0">
                      Empty
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A5346] line-clamp-1 mt-0.5 leading-snug">
                    Fresh white canvas with active 3mm bleed & safe margins
                  </p>
                </div>
              </div>

              {ATELIER_TEMPLATES.filter(
                (t) => templateFilter === "ALL" || t.category === templateFilter
              ).map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="group p-3 rounded-xl border border-[#E8E2D5] hover:border-[#D4AF37] bg-[#FDFBF7] hover:bg-white transition cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-black/10 shrink-0 flex items-center justify-center text-[10px] font-serif font-bold shadow-inner"
                      style={{
                        backgroundColor: tmpl.thumbnailColor,
                        color:
                          tmpl.thumbnailColor === "#12161A" || tmpl.thumbnailColor === "#241E19"
                            ? "#D4AF37"
                            : "#12161A",
                      }}
                    >
                      {tmpl.category === "WEDDING_CARD"
                        ? "5x7"
                        : tmpl.category === "VISITING_CARD"
                        ? "89x51"
                        : tmpl.category === "NAME_PLATE"
                        ? "ENG"
                        : "ART"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif font-bold text-xs text-[#12161A] truncate group-hover:text-[#B38F4D] transition">
                          {tmpl.name}
                        </span>
                        {tmpl.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-800 border border-amber-500/20 shrink-0">
                            {tmpl.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C8270] line-clamp-2 mt-0.5 leading-snug">
                        {tmpl.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-[#A29780] uppercase tracking-wider font-semibold">
                          {tmpl.category.replace("_", " ")}
                        </span>
                        <span className="text-[#D4AF37] font-semibold group-hover:translate-x-0.5 transition-transform">
                          Apply to Canvas →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tab 2: Elements & Typography Tools */
          <div className="p-5 overflow-y-auto space-y-6 flex-1 max-h-[calc(100vh-180px)] custom-scrollbar">
            {/* Category Selector */}
            <div>
              <label className="text-[11px] font-bold text-[#8C8270] uppercase tracking-wider block mb-2">
                Stationery Category
              </label>
              <select
                value={activeCategory}
                onChange={(e) => {
                  const newCat = e.target.value as any;
                  setActiveCategory(newCat);
                  setCategory(newCat);
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#DCD5C5] text-xs font-semibold bg-[#FDFBF7] text-[#12161A] focus:outline-none focus:border-[#12161A]"
              >
                <option value="VISITING_CARD">Artisan Visiting Cards (89x51 mm)</option>
                <option value="STICKER">Die-Cut Vinyl Stickers (Square/Circle)</option>
                <option value="WEDDING_CARD">Royal Wedding Invitation (5x7 in)</option>
                <option value="ENVELOPE">Handmade Deckle Envelope Liner</option>
                <option value="NAME_PLATE">Brass & Acrylic Name Plates</option>
                <option value="CERTIFICATE">Formal Parchment Certificate (A4)</option>
                <option value="BOOK_COVER">Linen Book Cover (A5)</option>
              </select>
            </div>

            {/* Text Tool Block */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#8C8270] uppercase tracking-wider block">
                Add Typography
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addText("heading")}
                  className="p-2.5 rounded-lg border border-[#E8E2D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-xs font-serif font-bold text-[#12161A] transition text-center"
                >
                  Headline
                </button>
                <button
                  onClick={() => addText("subheading")}
                  className="p-2.5 rounded-lg border border-[#E8E2D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[11px] font-semibold text-[#5A5346] transition text-center uppercase tracking-wider"
                >
                  Subtitle
                </button>
                <button
                  onClick={() => addText("body")}
                  className="p-2.5 rounded-lg border border-[#E8E2D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-xs text-[#5A5346] transition text-center"
                >
                  Body
                </button>
              </div>
            </div>

            {/* Shapes & Borders Block */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#8C8270] uppercase tracking-wider block">
                Shapes & Borders
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addShape("rect")}
                  className="p-2.5 rounded-lg border border-[#E8E2D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-xs font-medium text-[#12161A] transition flex flex-col items-center gap-1"
                >
                  <Square size={16} />
                  <span>Box</span>
                </button>
                <button
                  onClick={() => addShape("circle")}
                  className="p-2.5 rounded-lg border border-[#E8E2D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-xs font-medium text-[#12161A] transition flex flex-col items-center gap-1"
                >
                  <Circle size={16} />
                  <span>Circle</span>
                </button>
                <button
                  onClick={() => addShape("gold_border")}
                  className="p-2.5 rounded-lg border border-[#D4AF37]/50 bg-[#FDFBF7] hover:bg-[#F3EFE6] text-xs font-medium text-[#B38F4D] transition flex flex-col items-center gap-1"
                >
                  <Sparkles size={16} />
                  <span>Foil Border</span>
                </button>
              </div>
            </div>

            {/* Logo & Artwork Upload */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#8C8270] uppercase tracking-wider block">
                Import Logo / Vector Art
              </span>
              <label className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-[#DCD5C5] hover:border-[#12161A] bg-[#FAF7F0] cursor-pointer text-xs font-medium text-[#5A5346] transition">
                <ImageIcon size={18} className="text-[#8C8270]" />
                <span>Upload PNG, SVG or JPG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Center Canvas Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-auto">
        {/* Top Control Bar: Active Selection Properties & Zoom */}
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#E8E2D5] shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* Object Styling (if Text or Shape selected) */}
          <div className="flex items-center gap-2">
            {selectedObject && (
              <>
                {/* Color Swatch Picker */}
                <div className="flex items-center gap-1.5 border-r border-[#E8E2D5] pr-3">
                  {["#12161A", "#D4AF37", "#9E2A2B", "#2D6A4F", "#3B4D61", "#FAF7F0"].map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() => updateTextColor(c)}
                        className={`w-5 h-5 rounded-full border border-black/20 transition ${
                          selectedColor === c ? "ring-2 ring-offset-1 ring-[#12161A]" : ""
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    )
                  )}
                </div>

                {/* Font Selector */}
                <select
                  value={selectedFont}
                  onChange={(e) => updateFontFamily(e.target.value)}
                  className="px-2 py-1 text-xs border border-[#DCD5C5] rounded bg-[#FDFBF7] text-[#12161A]"
                >
                  <option value="Playfair Display">Playfair Serif</option>
                  <option value="Plus Jakarta Sans">Jakarta Sans</option>
                  <option value="Courier New">Monospace Type</option>
                  <option value="Times New Roman">Classic Times</option>
                </select>

                {/* Font Size */}
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => updateFontSize(Number(e.target.value))}
                  className="w-14 px-1.5 py-1 text-xs border border-[#DCD5C5] rounded bg-[#FDFBF7] text-center"
                />

                {/* Layer arrange & delete */}
                <button
                  onClick={bringForward}
                  title="Bring Forward"
                  className="p-1.5 hover:bg-[#ECE6D8] rounded text-[#5A5346]"
                >
                  <Layers size={14} />
                </button>
                <button
                  onClick={deleteSelected}
                  title="Delete Selection"
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            {!selectedObject && (
              <span className="text-xs text-[#8C8270] italic">
                Select any text or shape on canvas to edit properties
              </span>
            )}
          </div>

          {/* Canvas View Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuides(!showGuides)}
              className={`px-2.5 py-1 text-xs rounded border transition flex items-center gap-1 ${
                showGuides
                  ? "bg-[#12161A] text-white border-[#12161A]"
                  : "bg-white text-[#5A5346] border-[#DCD5C5]"
              }`}
            >
              <Eye size={12} />
              <span>{showGuides ? "Hide Guides" : "Show Bleed"}</span>
            </button>

            <button
              onClick={() => handleZoom("out")}
              className="p-1 text-neutral-600 hover:text-black"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-[#8C8270] font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => handleZoom("in")}
              className="p-1 text-neutral-600 hover:text-black"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Visual Canvas Wrapper with 3mm Bleed Boundary */}
        <div className="relative p-8 bg-[#EBE6DC] rounded-xl shadow-inner border border-[#DCD5C5]">
          {/* Guide Legend */}
          {showGuides && (
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] text-[#736A58] pointer-events-none">
              <span className="text-red-700 font-mono">── Red: 3mm Bleed Margin</span>
              <span className="text-neutral-900 font-mono">── Trim Knife Line</span>
              <span className="text-emerald-700 font-mono">── Green: Safe Content Zone</span>
            </div>
          )}

          {/* Actual Fabric Canvas Element */}
          <div
            className={`relative bg-white shadow-2xl ${
              showGuides ? "bleed-boundary ring-4 ring-red-500/20" : ""
            }`}
            style={{
              width: canvasDims.width,
              height: canvasDims.height,
            }}
          >
            <canvas ref={canvasElRef} />

            {/* Inner Safe Margin Overlay Guide */}
            {showGuides && (
              <div
                className="absolute inset-[15px] pointer-events-none safe-zone-boundary"
                title="Keep important text inside this green safe margin"
              />
            )}
          </div>
        </div>

        {/* Bottom Status / Toast Banner */}
        {toastMessage && (
          <div className="mt-4 px-4 py-2 bg-[#12161A] text-white text-xs rounded-full shadow-lg border border-[#D4AF37]/40 animate-fade-in flex items-center gap-2">
            <Check size={14} className="text-[#D4AF37]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Right Sidebar: Prepress Specifications & Output Actions */}
      <div className="w-full lg:w-80 bg-white border-l border-[#E8E2D5] p-6 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar shrink-0">
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
              Prepress Calibration
            </span>
            <h3 className="font-serif font-bold text-lg text-[#12161A] mt-1">
              Print Specification
            </h3>
          </div>

          <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E5DEC9] space-y-2 text-xs text-[#5A5346]">
            <div className="flex justify-between">
              <span>Finished Trim:</span>
              <span className="font-semibold text-[#12161A]">
                {dimensionsMm.width} x {dimensionsMm.height} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guillotine Bleed:</span>
              <span className="font-semibold text-red-700">
                +{dimensionsMm.bleed} mm (All 4 Sides)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Color Model:</span>
              <span className="font-semibold text-[#12161A]">300 DPI CMYK Emulation</span>
            </div>
            <div className="flex justify-between">
              <span>Guillotine Marks:</span>
              <span className="font-semibold text-emerald-700">Auto Crop & Align Marks</span>
            </div>
          </div>

          {/* 3D Texture Map Integration */}
          <div className="p-4 rounded-xl border border-[#D4AF37]/50 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Box size={16} className="text-[#D4AF37]" />
              <span>3D Box Packaging Bridge</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Want to see this design wrapped seamlessly onto a 3D rigid box model?
            </p>
            <button
              onClick={handleSyncTo3DBox}
              className="w-full py-2 px-3 bg-[#12161A] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-neutral-800 transition"
            >
              Push Design to 3D Wrapper
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-6 border-t border-[#E8E2D5]">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="w-full py-3.5 px-4 bg-[#D4AF37] text-[#12161A] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={16} />
            <span>{isExporting ? "Compiling PDF..." : "Export 300 DPI Print PDF"}</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 px-4 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>Order Customized Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
}

