"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 192; // frames 000 – 191

const frameSrc = (n: number) =>
  `/frames/frame_${String(n).padStart(3, "0")}_delay-0.042s.jpg`;

// ─── Frame preloader ──────────────────────────────────────────────────────────

function preloadImages(count: number): HTMLImageElement[] {
  return Array.from({ length: count }, (_, i) => {
    const img = new Image();
    img.src = frameSrc(i);
    img.decoding = "async";
    return img;
  });
}

// --- Narrative overlays removed for minimalist Polish ---


// ─── Main Component ───────────────────────────────────────────────────────────

export default function AgoraCanvas() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 35,
    restDelta: 0.001,
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];

    if (!canvas || !img) return;

    // Ensure we only draw completed images to avoid flickering during first render
    if (!img.complete) return;

    lastFrameRef.current = idx;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    // Background sync to exactly #F5F7FA
    ctx.fillStyle = "#F5F7FA";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);


  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    const w = Math.round(width * window.devicePixelRatio);
    const h = Math.round(height * window.devicePixelRatio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      lastFrameRef.current = -1;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (canvasRef.current) ro.observe(canvasRef.current);
    window.addEventListener("resize", resizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const images = preloadImages(TOTAL_FRAMES);
    imagesRef.current = images;

    // Instant Render Fix: Draw frame 0 immediately once ready
    const frame0 = images[0];
    if (frame0) {
      const onImageLoad = () => {
        if (lastFrameRef.current === -1) {
          drawFrame(0);
        }
      };
      if (frame0.complete) onImageLoad();
      else frame0.addEventListener("load", onImageLoad);
    }
  }, [drawFrame]);

  useEffect(() => {
    return frameIndex.on("change", (rawIndex) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(rawIndex)));
      drawFrame(idx);
    });
  }, [frameIndex, drawFrame]);


  return (
    <div ref={scrollContainerRef} className="relative" style={{ height: "400vh" }}>
      <div className="canvas-sticky-container">

        {/* Background base */}
        <div className="absolute inset-0 bg-[#F5F7FA]" aria-hidden="true" />

        {/* Image sequence */}
        <canvas
          ref={canvasRef}
          aria-label="3D animation of the Agora Marketplace"
          className="relative w-full h-full block mix-blend-multiply"
          style={{
            filter: "contrast(1.1) brightness(1.05)",
          }}
        />

      </div>
    </div>
  );
}
