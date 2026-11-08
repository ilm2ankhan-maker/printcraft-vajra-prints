"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { useDesignStore } from "@/store/useDesignStore";
import { useCartStore } from "@/store/useCartStore";
import { calculateProductPrice } from "@/lib/pricing";
import { INITIAL_PRODUCTS } from "@/lib/mockData";
import {
  Box as BoxIcon,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Eye,
  Sliders,
} from "@/components/ui/icons";
import Link from "next/link";

// 3D Packaging Box Mesh
function PackagingBoxMesh({
  width = 1.8,
  height = 0.6,
  depth = 1.2,
  textureUrl,
  presetStyle = "noir_gold",
  boxColor,
}: {
  width: number;
  height: number;
  depth: number;
  textureUrl?: string | null;
  presetStyle: string;
  boxColor?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [customTexture, setCustomTexture] = useState<THREE.Texture | null>(null);

  // Load custom canvas texture via TextureLoader if available
  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(textureUrl, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setCustomTexture(tex);
      });
    } else {
      setCustomTexture(null);
    }
  }, [textureUrl]);

  // Subtle auto-rotation when idle
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  // Base materials according to preset style or boxColor
  let baseColor = boxColor || "#12161A";
  let roughness = 0.45;
  let metalness = 0.1;

  if (presetStyle === "ivory_linen") {
    baseColor = boxColor || "#F7F4EC";
    roughness = 0.75;
    metalness = 0.05;
  } else if (presetStyle === "emerald_velvet") {
    baseColor = boxColor || "#1B3B2B";
    roughness = 0.6;
    metalness = 0.2;
  } else if (presetStyle === "kraft_recycled") {
    baseColor = boxColor || "#C4A482";
    roughness = 0.85;
    metalness = 0.02;
  }

  // Ensure material updates whenever color, texture or style changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [baseColor, customTexture, roughness, metalness]);

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          ref={materialRef}
          map={customTexture || undefined}
          color={customTexture ? "#FFFFFF" : baseColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Gilded Accent Foil Stamp Band / Ribbon */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[width * 1.002, height * 1.002, depth * 0.25]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

export default function Box3DCustomizer() {
  const boxTextureUrl = useDesignStore((state) => state.wrapperTextureUrl || state.boxTextureUrl);
  const setBoxTextureUrl = useDesignStore((state) => state.setBoxTextureUrl);
  const setWrapperTextureUrl = useDesignStore((state) => state.setWrapperTextureUrl);
  const boxColor = useDesignStore((state) => state.boxColor);
  const setBoxColor = useDesignStore((state) => state.setBoxColor);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [boxDimensions, setBoxDimensions] = useState({
    lengthMm: 180,
    widthMm: 120,
    heightMm: 60,
  });

  const [presetStyle, setPresetStyle] = useState("noir_gold");
  const [boardGrade, setBoardGrade] = useState("kappa_1200");
  const [closureType, setClosureType] = useState("magnetic");
  const [orderQuantity, setOrderQuantity] = useState(50);
  const [addedToast, setAddedToast] = useState(false);

  const boxProduct = INITIAL_PRODUCTS.find((p) => p.category === "CUSTOM_BOX") || INITIAL_PRODUCTS[3];

  const priceBreakdown = calculateProductPrice({
    product: boxProduct,
    quantity: orderQuantity,
    selectedOptions: {
      paper: boardGrade,
      finish: closureType,
    },
  });

  const handleResetTheme = () => {
    setWrapperTextureUrl(null);
    setBoxTextureUrl(null);
    setPresetStyle("noir_gold");
    setBoxColor("#12161A");
  };

  const handleAddToCart = () => {
    addItemToCart({
      productId: boxProduct.id,
      productName: `Custom 3D Rigid Packaging Box (${boxDimensions.lengthMm}x${boxDimensions.widthMm}x${boxDimensions.heightMm}mm)`,
      productImage: boxProduct.imageUrl,
      category: "CUSTOM_BOX",
      quantity: orderQuantity,
      unitPrice: priceBreakdown.unitPrice,
      totalPrice: priceBreakdown.subtotal,
      selectedOptions: {
        dimensions: `${boxDimensions.lengthMm}x${boxDimensions.widthMm}x${boxDimensions.heightMm} mm`,
        board: boardGrade,
        closure: closureType,
        style: presetStyle,
        hasCustomTexture: boxTextureUrl ? "Yes (Mapped from 2D Studio)" : "Preset Texture",
      },
      designSnapshot: {
        previewUrl: boxTextureUrl || boxProduct.imageUrl,
        widthMm: boxDimensions.lengthMm,
        heightMm: boxDimensions.widthMm,
        title: "3D Rigid Packaging Wrapper",
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)] bg-[#F5F2EB] border-t border-[#E5DEC9]">
      {/* 3D Interactive Viewport */}
      <div className="flex-1 relative min-h-[450px] lg:min-h-full bg-gradient-to-b from-[#EBE6DC] to-[#DED8CC] flex items-center justify-center overflow-hidden">
        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E2D5] text-xs font-semibold text-[#12161A] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Real-Time R3F 3D Packaging Renderer</span>
        </div>

        {boxTextureUrl && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12161A] text-[#FDFBF7] text-xs font-semibold shadow-md">
              <Check size={14} className="text-[#D4AF37]" />
              <span>2D Studio Texture Active</span>
            </div>
            <button
              onClick={handleResetTheme}
              className="px-3 py-1.5 rounded-full bg-white/95 text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold shadow-sm transition flex items-center gap-1"
              title="Remove 2D wrapper texture and restore full color controls"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [3, 2.5, 3.5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#D4AF37" />
          <pointLight position={[0, 4, 0]} intensity={1} color="#FFFDF7" />

          <PackagingBoxMesh
            width={boxDimensions.lengthMm / 100}
            height={boxDimensions.heightMm / 100}
            depth={boxDimensions.widthMm / 100}
            textureUrl={boxTextureUrl}
            presetStyle={presetStyle}
            boxColor={boxColor}
          />

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.6}
            scale={8}
            blur={2.5}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={7}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Canvas>

        {/* Viewport Control Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-medium pointer-events-none">
          Click & Drag to rotate 360° • Scroll to zoom
        </div>
      </div>

      {/* Right Sidebar: Configurator & Pricing Engine */}
      <div className="w-full lg:w-96 bg-white border-l border-[#E8E2D5] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              Structural Packaging
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#12161A] mt-1">
              Custom 3D Rigid Box
            </h2>
            <p className="text-xs text-[#5A5346] mt-1">
              Precision fabricated using European grey board wrapped with your custom artwork.
            </p>
          </div>

          {/* Texture & Material Style Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#12161A] uppercase tracking-wider block">
                Surface Aesthetic Preset:
              </span>
              {boxTextureUrl && (
                <button
                  onClick={handleResetTheme}
                  className="text-[11px] text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1 transition"
                >
                  <RotateCcw size={11} />
                  <span>Remove 2D Texture</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "noir_gold", label: "Noir & Gold Foil", color: "#12161A" },
                { id: "ivory_linen", label: "Ivory Cotton Linen", color: "#F7F4EC" },
                { id: "emerald_velvet", label: "Emerald Luxury", color: "#1B3B2B" },
                { id: "kraft_recycled", label: "Kraft Recycled", color: "#C4A482" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setPresetStyle(style.id);
                    setBoxColor(style.color);
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition flex items-center gap-2 ${
                    presetStyle === style.id
                      ? "border-[#12161A] bg-[#FAF7F0] font-semibold text-[#12161A]"
                      : "border-[#E8E2D5] text-[#5A5346] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: style.color }}
                  />
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Color Palette Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#12161A] uppercase tracking-wider block">
                Direct Color Tint:
              </span>
              {boxTextureUrl && (
                <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  White Base for 2D Texture
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                "#12161A",
                "#F7F4EC",
                "#1B3B2B",
                "#C4A482",
                "#8A1C14",
                "#1A2E40",
                "#D4AF37",
                "#3D2817",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setBoxColor(c);
                    if (boxTextureUrl) {
                      setWrapperTextureUrl(null);
                      setBoxTextureUrl(null);
                    }
                  }}
                  className={`w-6 h-6 rounded-full border border-black/20 transition ${
                    boxColor === c && !boxTextureUrl
                      ? "ring-2 ring-offset-2 ring-[#12161A] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Apply ${c} & enable full color shading`}
                />
              ))}
            </div>
          </div>

          {/* Reset Box Theme / Remove 2D Texture button */}
          <div className="pt-1">
            <button
              onClick={handleResetTheme}
              className="w-full py-2 px-3 rounded-lg border border-[#DCD5C5] bg-[#FAF7F0] hover:bg-[#F3EFE6] text-xs font-semibold text-[#5A5346] transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} className="text-[#8C8270]" />
              <span>Reset Box Theme / Remove 2D Texture</span>
            </button>
          </div>

          {/* 2D Canvas Bridge CTA */}
          <div className="p-3.5 rounded-xl border border-[#D4AF37]/50 bg-amber-50/60 space-y-2">
            <span className="text-xs font-bold text-[#12161A] block">
              Want Custom Graphics on this Box?
            </span>
            <p className="text-[11px] text-[#5A5346] leading-relaxed">
              Open our 2D Canva studio to add custom logos, gold monograms, and typography, then click
              &quot;Push to 3D Wrapper&quot;.
            </p>
            <Link
              href="/editor?category=VISITING_CARD"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
            >
              <Sparkles size={14} />
              <span>Open 2D Studio to Design Wrapper →</span>
            </Link>
          </div>

          {/* Dimension Controls */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#12161A] uppercase tracking-wider block">
              Box Dimensions (Millimeters):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#8C8270] block mb-1">Length</label>
                <input
                  type="number"
                  min="100"
                  max="400"
                  value={boxDimensions.lengthMm}
                  onChange={(e) =>
                    setBoxDimensions({ ...boxDimensions, lengthMm: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1.5 rounded border border-[#DCD5C5] text-xs text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8C8270] block mb-1">Width</label>
                <input
                  type="number"
                  min="80"
                  max="300"
                  value={boxDimensions.widthMm}
                  onChange={(e) =>
                    setBoxDimensions({ ...boxDimensions, widthMm: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1.5 rounded border border-[#DCD5C5] text-xs text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8C8270] block mb-1">Height</label>
                <input
                  type="number"
                  min="40"
                  max="180"
                  value={boxDimensions.heightMm}
                  onChange={(e) =>
                    setBoxDimensions({ ...boxDimensions, heightMm: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1.5 rounded border border-[#DCD5C5] text-xs text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Closure Type */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#12161A] uppercase tracking-wider block">
              Box Closure Style:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setClosureType("magnetic")}
                className={`p-2.5 rounded-lg border text-xs text-left transition ${
                  closureType === "magnetic"
                    ? "border-[#12161A] bg-[#12161A] text-white font-semibold"
                    : "border-[#E8E2D5] bg-white text-[#5A5346]"
                }`}
              >
                Magnetic Flap Lid (+₹250)
              </button>
              <button
                onClick={() => setClosureType("lid_base")}
                className={`p-2.5 rounded-lg border text-xs text-left transition ${
                  closureType === "lid_base"
                    ? "border-[#12161A] bg-[#12161A] text-white font-semibold"
                    : "border-[#E8E2D5] bg-white text-[#5A5346]"
                }`}
              >
                Two-Piece Lid & Base
              </button>
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#12161A] uppercase tracking-wider">
                Batch Quantity:
              </span>
              <span className="font-serif font-bold text-base text-[#12161A]">
                {orderQuantity} boxes
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
              className="w-full accent-[#12161A] cursor-pointer"
            />
          </div>
        </div>

        {/* Price Summary & Add to Cart */}
        <div className="pt-6 border-t border-[#E8E2D5] space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C8270] block">
                Total Estimated Price
              </span>
              <span className="text-3xl font-serif font-bold text-[#12161A]">
                ₹{priceBreakdown.total.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-xs text-[#8C8270]">
              ₹{priceBreakdown.unitPrice}/box (incl. GST)
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 px-4 bg-[#12161A] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition shadow-md flex items-center justify-center gap-2 border border-[#D4AF37]/50"
          >
            <ShoppingBag size={16} />
            <span>Order Customized 3D Boxes</span>
          </button>

          {addedToast && (
            <p className="text-center text-xs font-semibold text-emerald-700">
              ✓ Custom 3D packaging added to cart!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

