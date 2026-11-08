"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// 3D Procedural Envelope Mesh
function FloatingEnvelope({
  position,
  rotation,
  scale = 1,
  color = "#F8F5EE",
  accentColor = "#D4AF37",
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  color?: string;
  accentColor?: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle breathing float
    meshRef.current.position.y += Math.sin(t * 1.2 + position[0]) * 0.0015;
    meshRef.current.rotation.x += Math.cos(t * 0.8) * 0.0008;
    meshRef.current.rotation.y += Math.sin(t * 0.9) * 0.0008;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Envelope Main Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.6, 0.05]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.08}
        />
      </mesh>

      {/* Triangular Flap */}
      <mesh position={[0, 0.45, 0.03]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[1.2, 0.7, 3]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Gilded Wax Seal on Flap */}
      <mesh position={[0, 0.15, 0.06]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

// 3D Deckle Edge Card Mesh
function FloatingCard({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const cardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!cardRef.current) return;
    const t = state.clock.getElapsedTime();
    cardRef.current.rotation.z += Math.sin(t * 0.7) * 0.0005;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={cardRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.8, 1.1, 0.02]} />
        <meshStandardMaterial
          color="#FFFDF9"
          roughness={0.8}
          metalness={0.02}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const sceneGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // GSAP Scroll Motion integration
    const handleScroll = () => {
      if (!sceneGroupRef.current) return;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      gsap.to(sceneGroupRef.current.rotation, {
        y: scrollProgress * Math.PI * 0.8,
        x: scrollProgress * 0.35,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(sceneGroupRef.current.position, {
        y: scrollProgress * -1.5,
        z: scrollProgress * 0.8,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <group ref={sceneGroupRef}>
      {/* Lighting setup for tactile luxury paper feel */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 6]} intensity={1.8} castShadow />
      <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#D4AF37" />
      <pointLight position={[0, 2, 4]} intensity={0.9} color="#FFFDF7" />

      {/* Floating envelopes in space */}
      <FloatingEnvelope
        position={[2.4, 0.6, -1]}
        rotation={[0.2, -0.4, 0.15]}
        scale={1.1}
        color="#F8F4EC"
        accentColor="#D4AF37"
      />

      <FloatingEnvelope
        position={[-2.6, 1.2, -2]}
        rotation={[-0.15, 0.5, -0.2]}
        scale={0.9}
        color="#ECE6D8"
        accentColor="#C5A059"
      />

      <FloatingEnvelope
        position={[2.8, -1.8, -1.5]}
        rotation={[0.3, -0.25, -0.1]}
        scale={0.85}
        color="#2B2D2F" // Charcoal envelope
        accentColor="#E5C158"
      />

      <FloatingEnvelope
        position={[-2.2, -2.1, -1]}
        rotation={[0.1, 0.3, 0.2]}
        scale={0.95}
        color="#F3EFE6"
        accentColor="#B38F4D"
      />

      {/* Floating Visiting Cards */}
      <FloatingCard position={[-1.2, -0.4, 0]} rotation={[0.1, 0.2, -0.1]} scale={1} />
      <FloatingCard position={[1.4, 1.8, -0.5]} rotation={[-0.2, -0.3, 0.25]} scale={0.9} />

      {/* Gold & Champagne artisan sparkles */}
      <Sparkles
        count={50}
        scale={8}
        size={2.5}
        speed={0.4}
        color="#D4AF37"
        opacity={0.65}
      />
    </group>
  );
}

export default function Background3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#F8F5EE] to-[#F3EFE6] -z-10" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

