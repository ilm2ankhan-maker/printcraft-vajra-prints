"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Scissors,
  UploadCloud,
  Check,
  ShoppingBag,
  Sparkles,
  Sliders,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "@/components/ui/icons";
import { useCartStore } from "@/store/useCartStore";
import { INITIAL_PRODUCTS } from "@/lib/mockData";
import { calculateProductPrice } from "@/lib/pricing";

interface PresetShape {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  cutLengthMm: number;
  pierceCount: number;
  description: string;
  svgPath: string;
}

const PRESET_SHAPES: PresetShape[] = [
  {
    id: "shape_lattice",
    name: "Architectural Jali Lattice Screen",
    widthMm: 300,
    heightMm: 200,
    cutLengthMm: 1850,
    pierceCount: 16,
    description: "Intricate Moroccan floral lattice for interior diffusers and backlit wall decor.",
    svgPath:
      "M 20 20 H 280 V 180 H 20 Z M 60 60 H 120 V 120 H 60 Z M 160 60 H 220 V 120 H 160 Z M 70 70 L 110 110 M 110 70 L 70 110 M 170 70 L 210 110 M 210 70 L 170 110",
  },
  {
    id: "shape_mandala",
    name: "Acanthus Sunburst Mandala",
    widthMm: 250,
    heightMm: 250,
    cutLengthMm: 2400,
    pierceCount: 24,
    description: "Radial concentric filigree with micro-fillet kerf tolerance.",
    svgPath:
      "M 125 15 A 110 110 0 1 0 125 235 A 110 110 0 1 0 125 15 Z M 125 45 A 80 80 0 1 0 125 205 A 80 80 0 1 0 125 45 Z M 125 75 A 50 50 0 1 0 125 175 A 50 50 0 1 0 125 75 Z",
  },
  {
    id: "shape_sign",
    name: "Hexagonal Corporate Name Plate Crest",
    widthMm: 220,
    heightMm: 190,
    cutLengthMm: 890,
    pierceCount: 6,
    description: "Geometric geometric sign with mounting holes for standoff brass bolts.",
    svgPath:
      "M 110 10 L 200 60 L 200 140 L 110 190 L 20 140 L 20 60 Z M 40 40 A 5 5 0 1 0 40 50 A 5 5 0 1 0 40 40 Z M 180 40 A 5 5 0 1 0 180 50 A 5 5 0 1 0 180 40 Z",
  },
  {
    id: "shape_coasters",
    name: "Artisan Coaster Quad Suite (4 pcs)",
    widthMm: 200,
    heightMm: 200,
    cutLengthMm: 1280,
    pierceCount: 8,
    description: "Set of 4 circular drink coasters with botanical silhouette engravings.",
    svgPath:
      "M 55 15 A 40 40 0 1 0 55 95 A 40 40 0 1 0 55 15 Z M 145 15 A 40 40 0 1 0 145 95 A 40 40 0 1 0 145 15 Z M 55 105 A 40 40 0 1 0 55 185 A 40 40 0 1 0 55 105 Z M 145 105 A 40 40 0 1 0 145 185 A 40 40 0 1 0 145 105 Z",
  },
];

export default function LaserCuttingPage() {
  const [selectedShape, setSelectedShape] = useState<PresetShape>(PRESET_SHAPES[0]);
  const [customFileLoaded, setCustomFileLoaded] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  const [activeMaterial, setActiveMaterial] = useState("birch_3mm");
  const [quantity, setQuantity] = useState(1);
  const [laserSpeedSim, setLaserSpeedSim] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  // SVG parsing specs
  const [cutSpecs, setCutSpecs] = useState({
    widthMm: PRESET_SHAPES[0].widthMm,
    heightMm: PRESET_SHAPES[0].heightMm,
    cutLengthMm: PRESET_SHAPES[0].cutLengthMm,
    pierceCount: PRESET_SHAPES[0].pierceCount,
    svgPath: PRESET_SHAPES[0].svgPath,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const addItemToCart = useCartStore((state) => state.addItem);

  const laserProduct =
    INITIAL_PRODUCTS.find((p) => p.category === "LASER_CUTTING") ||
    INITIAL_PRODUCTS[4];

  // Algorithmic dynamic price calculation
  const priceBreakdown = calculateProductPrice({
    product: laserProduct,
    quantity,
    selectedOptions: {
      material: activeMaterial,
    },
    laserSpecs: {
      cutLengthMm: cutSpecs.cutLengthMm,
      widthMm: cutSpecs.widthMm,
      heightMm: cutSpecs.heightMm,
      material: activeMaterial,
      pierceCount: cutSpecs.pierceCount,
    },
  });

  // Handle Preset Shape selection
  const handleSelectPreset = (shape: PresetShape) => {
    setSelectedShape(shape);
    setCustomFileLoaded(false);
    setCutSpecs({
      widthMm: shape.widthMm,
      heightMm: shape.heightMm,
      cutLengthMm: shape.cutLengthMm,
      pierceCount: shape.pierceCount,
      svgPath: shape.svgPath,
    });
  };

  // Handle SVG / DXF File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith(".svg")) {
        // Parse SVG to extract paths and bounding box
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "image/svg+xml");
          const paths = doc.querySelectorAll("path, rect, circle, polygon, line");

          let pathStrings = "";
          let estimatedLength = 0;

          paths.forEach((node) => {
            if (node.tagName.toLowerCase() === "path") {
              const d = node.getAttribute("d") || "";
              pathStrings += " " + d;
              estimatedLength += d.length * 2.2; // heuristic for path vector segments
            } else if (node.tagName.toLowerCase() === "rect") {
              const w = Number(node.getAttribute("width") || 100);
              const h = Number(node.getAttribute("height") || 100);
              estimatedLength += (w + h) * 2;
            } else if (node.tagName.toLowerCase() === "circle") {
              const r = Number(node.getAttribute("r") || 50);
              estimatedLength += 2 * Math.PI * r;
            }
          });

          const calculatedCutMm = Math.max(450, Math.round(estimatedLength));
          const calculatedPierces = Math.max(2, paths.length);

          setCutSpecs({
            widthMm: 280,
            heightMm: 200,
            cutLengthMm: calculatedCutMm,
            pierceCount: calculatedPierces,
            svgPath: pathStrings || PRESET_SHAPES[0].svgPath,
          });
          setCustomFileLoaded(true);
        } catch (err) {
          console.error("SVG parsing error:", err);
        }
      } else {
        // DXF format heuristic
        setCutSpecs({
          widthMm: 250,
          heightMm: 180,
          cutLengthMm: 1450,
          pierceCount: 12,
          svgPath: PRESET_SHAPES[2].svgPath,
        });
        setCustomFileLoaded(true);
      }
    };
    reader.readAsText(file);
  };

  // Live Laser Toolpath Simulation Animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark CNC workspace bed
      ctx.fillStyle = "#181B1E";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid rules (every 20px)
      ctx.strokeStyle = "#252A2F";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Substrate Material Boundary
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.setLineDash([]);

      // Draw Vector Cut Path
      ctx.save();
      ctx.translate(canvas.width / 2 - 140, canvas.height / 2 - 100);
      const path2d = new Path2D(cutSpecs.svgPath);
      ctx.strokeStyle = "#38BDF8"; // Cyan laser path
      ctx.lineWidth = 2;
      ctx.stroke(path2d);

      // Animated glowing laser head beam
      if (laserSpeedSim) {
        step += 0.03;
        const laserX = 140 + Math.cos(step) * 90;
        const laserY = 100 + Math.sin(step * 2) * 50;

        // Spark / glow gradient
        const grad = ctx.createRadialGradient(laserX, laserY, 1, laserX, laserY, 18);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(239, 68, 68, 0.9)");
        grad.addColorStop(0.7, "rgba(245, 158, 11, 0.4)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(laserX, laserY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Hot pinpoint center
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(laserX, laserY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [cutSpecs, laserSpeedSim]);

  const handleAddToCart = () => {
    addItemToCart({
      productId: laserProduct.id,
      productName: `Architectural Laser Cut - ${customFileLoaded ? customFileName : selectedShape.name}`,
      productImage: laserProduct.imageUrl,
      category: "LASER_CUTTING",
      quantity,
      unitPrice: priceBreakdown.unitPrice,
      totalPrice: priceBreakdown.subtotal,
      selectedOptions: {
        material: activeMaterial,
        cutLength: `${cutSpecs.cutLengthMm} mm`,
        area: `${cutSpecs.widthMm}x${cutSpecs.heightMm} mm`,
      },
      laserSpecs: {
        cutLengthMm: cutSpecs.cutLengthMm,
        areaCm2: Math.round((cutSpecs.widthMm * cutSpecs.heightMm) / 100),
        material: activeMaterial,
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const materials = [
    { id: "birch_3mm", name: "3mm Baltic Birch Plywood", rateInfo: "Warm laser kerf, organic finish" },
    { id: "acrylic_5mm", name: "5mm Clear Cast Acrylic", rateInfo: "Flame-polished glass edge" },
    { id: "acrylic_frosted", name: "3mm Matte Frosted Black Acrylic", rateInfo: "Modern architectural signage" },
    { id: "brass_sheet", name: "1.5mm Mirror Brass Sheet", rateInfo: "Deep laser cut & gilded shine" },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A]/5 border border-[#12161A]/10 text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-3">
          <Scissors size={14} className="text-[#D4AF37]" />
          <span>Architectural Vector Laser Fabrication</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#12161A] tracking-tight">
          Sub-Millimeter Laser Cutting Engine
        </h1>
        <p className="mt-3 text-base text-[#5A5346] leading-relaxed">
          Upload custom SVG / DXF vector paths or pick signature architectural motifs.
          Our algorithmic pricing engine calculates material area, total cutting length, and piercing
          runtime instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shape Picker & File Upload */}
        <div className="lg:col-span-4 space-y-6">
          {/* File Upload Zone */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C8270] block">
              Option A: Upload Your Vector File
            </span>
            <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#DCD5C5] hover:border-[#12161A] bg-[#FAF7F0] cursor-pointer transition text-center">
              <UploadCloud size={28} className="text-[#8C8270] mb-2" />
              <span className="text-xs font-semibold text-[#12161A] block">
                {customFileLoaded ? customFileName : "Upload SVG or DXF Toolpath"}
              </span>
              <span className="text-[11px] text-[#8C8270] mt-1">
                Auto-extracts vector length & pierce count
              </span>
              <input
                type="file"
                accept=".svg,.dxf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {customFileLoaded && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                <span>Vector parsed: {cutSpecs.cutLengthMm} mm cut path</span>
              </div>
            )}
          </div>

          {/* Preset Shape Selector */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C8270] block">
              Option B: Pick Signature Vajra Prints Shapes
            </span>
            <div className="space-y-2">
              {PRESET_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleSelectPreset(shape)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                    !customFileLoaded && selectedShape.id === shape.id
                      ? "border-[#12161A] bg-[#FAF7F0] font-semibold text-[#12161A] shadow-sm"
                      : "border-[#E8E2D5] text-[#5A5346] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif text-sm font-bold text-[#12161A]">
                      {shape.name}
                    </span>
                    <span className="text-[10px] text-[#8C8270]">
                      {shape.widthMm}x{shape.heightMm} mm
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736A58] line-clamp-1">
                    {shape.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Live Laser Toolpath Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#181B1E] p-4 rounded-2xl border border-neutral-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 px-2 border-b border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-white font-mono text-[11px]">CO2 Optical CNC Laser Bed</span>
              </div>
              <button
                onClick={() => setLaserSpeedSim(!laserSpeedSim)}
                className="text-[10px] text-[#D4AF37] hover:underline"
              >
                {laserSpeedSim ? "Pause Simulation" : "Run Simulation"}
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={420}
              height={320}
              className="w-full h-auto rounded-lg mt-3"
            />

            <div className="mt-3 px-2 flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>Path: {cutSpecs.cutLengthMm} mm</span>
              <span>Pierces: {cutSpecs.pierceCount} pts</span>
              <span>Substrate: {cutSpecs.widthMm} x {cutSpecs.heightMm} mm</span>
            </div>
          </div>

          {/* Substrate Material Choice */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#12161A] block">
              Substrate Material:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    activeMaterial === mat.id
                      ? "border-[#12161A] bg-[#12161A] text-white font-semibold"
                      : "border-[#E8E2D5] bg-[#FDFBF7] text-[#5A5346] hover:bg-[#F3EFE6]"
                  }`}
                >
                  <span className="block font-medium">{mat.name}</span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      activeMaterial === mat.id ? "text-[#D4AF37]" : "text-[#8C8270]"
                    }`}
                  >
                    {mat.rateInfo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Algorithmic Price Engine & Checkout */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E5DEC9] shadow-md space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Algorithmic Breakdown
            </span>
            <h3 className="font-serif font-bold text-xl text-[#12161A]">
              Live Fabrication Quote
            </h3>

            {priceBreakdown.laserBreakdown && (
              <div className="space-y-2.5 text-xs text-[#5A5346] border-t border-[#E8E2D5] pt-3">
                <div className="flex justify-between">
                  <span>Substrate Material Cost:</span>
                  <span className="font-medium text-[#12161A]">
                    ₹{priceBreakdown.laserBreakdown.materialCost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vector Cut Path ({cutSpecs.cutLengthMm} mm):</span>
                  <span className="font-medium text-[#12161A]">
                    ₹{priceBreakdown.laserBreakdown.cuttingTimeCost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Piercing & Setup Fee:</span>
                  <span className="font-medium text-[#12161A]">
                    ₹{priceBreakdown.laserBreakdown.setupFee + priceBreakdown.laserBreakdown.pierceCost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-medium text-[#12161A]">
                    ₹{priceBreakdown.taxGst}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Delivery:</span>
                  <span className="font-medium text-emerald-700">
                    {priceBreakdown.shippingFee === 0 ? "FREE" : `₹${priceBreakdown.shippingFee}`}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E8E2D5] space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#8C8270] block">
                Net Investment
              </span>
              <span className="text-3xl font-serif font-bold text-[#12161A] block">
                ₹{priceBreakdown.total.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-[#8C8270]">
                Turnaround: 24-48 hours in Bengaluru studio (Cottonpet)
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#12161A]">Order Pieces:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 rounded border border-[#DCD5C5] text-xs text-center font-mono"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/50"
              >
                <ShoppingBag size={16} />
                <span>Add Laser Job to Cart</span>
              </button>

              {addedToast && (
                <p className="text-center text-xs font-semibold text-emerald-700">
                  ✓ Laser cutting job added to cart!
                </p>
              )}
            </div>
          </div>

          <div className="card-luxury p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12161A]">
              <ShieldCheck size={16} className="text-[#D4AF37]" />
              <span>Kerf Tolerance & Materials</span>
            </div>
            <p className="text-xs text-[#5A5346] leading-relaxed">
              We operate high-power sealed CO2 laser tubes calibrated to 0.1mm kerf beam width.
              Protective surface films are retained during cutting to guarantee burn-free edges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

