"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from "motion/react";

const TOTAL_FRAMES = 192;
const FRAME_PATH = "/sequence/ezgif-frame-";

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `${FRAME_PATH}${padded}.jpg`;
}

/* ─── Text Overlay Data ─── */
interface Overlay {
  id: string;
  start: number;
  end: number;
  align: "center" | "left" | "right";
  content: React.ReactNode;
}

const overlays: Overlay[] = [
  {
    id: "hero",
    start: 0,
    end: 0.2,
    align: "center",
    content: (
      <div className="text-center">
        <h1 className="text-[clamp(2.5rem,7vw,8rem)] font-bold tracking-[-0.04em] leading-[0.9]">
          Stack<span className="text-[var(--color-accent)]">shift</span>
        </h1>
        <p className="mt-4 text-[clamp(0.875rem,1.5vw,1.25rem)] text-[var(--color-muted)] font-light tracking-wide">
          Redefine Your Digital Presence
        </p>
      </div>
    ),
  },
  {
    id: "slogan1",
    start: 0.25,
    end: 0.45,
    align: "left",
    content: (
      <div className="max-w-[600px]">
        <h2 className="text-[clamp(2rem,5vw,5rem)] font-bold tracking-[-0.03em] leading-[1]">
          Where Vision
          <br />
          Meets <span className="text-[var(--color-accent)]">Velocity</span>
        </h2>
        <p className="mt-4 text-[var(--color-muted)] text-lg font-light">
          We transform ambitious ideas into blazing-fast digital realities.
        </p>
      </div>
    ),
  },
  {
    id: "slogan2",
    start: 0.5,
    end: 0.7,
    align: "right",
    content: (
      <div className="max-w-[600px] text-right">
        <h2 className="text-[clamp(2rem,5vw,5rem)] font-bold tracking-[-0.03em] leading-[1]">
          Engineered for
          <br />
          <span className="text-[var(--color-accent)]">Impact</span>
        </h2>
        <p className="mt-4 text-[var(--color-muted)] text-lg font-light">
          Every pixel, every interaction — meticulously crafted.
        </p>
      </div>
    ),
  },
  {
    id: "cta",
    start: 0.8,
    end: 1,
    align: "center",
    content: (
      <div className="text-center">
        <h2 className="text-[clamp(2rem,5vw,5rem)] font-bold tracking-[-0.03em] leading-[1] mb-8">
          Ready to <span className="text-[var(--color-accent)]">Launch</span>?
        </h2>
        <MagneticButton />
      </div>
    ),
  },
];

/* ─── Magnetic Button ─── */
function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0)";
    btn.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (btn) btn.style.transition = "";
    }, 500);
  };

  return (
    <button
      ref={ref}
      className="magnetic-btn"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span>Start Your Project</span>
    </button>
  );
}

/* ─── Main Component ─── */
export default function SequenceScroll({
  onLoadProgress,
  onLoaded,
}: {
  onLoadProgress?: (p: number) => void;
  onLoaded?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1]
  );

  /* ─── Preload images ─── */
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      
      img.onload = () => {
        if (isCancelled) return;
        loaded++;
        onLoadProgress?.(loaded / TOTAL_FRAMES);
        if (loaded === TOTAL_FRAMES) {
          console.log("All images loaded successfully!");
          imagesRef.current = images;
          setIsReady(true);
          onLoaded?.();
        }
      };
      
      img.onerror = () => {
        if (isCancelled) return;
        console.error(`Failed to load frame: ${img.src}`);
        loaded++;
        onLoadProgress?.(loaded / TOTAL_FRAMES);
        if (loaded === TOTAL_FRAMES) {
          console.log("Finished loading with some errors.");
          imagesRef.current = images;
          setIsReady(true);
          onLoaded?.();
        }
      };
      
      images.push(img);
    }

    return () => {
      isCancelled = true;
    };
  }, [onLoadProgress, onLoaded]);

  /* ─── Draw to canvas ─── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    
    if (!canvas || !ctx) return;
    
    if (!img) {
      console.warn(`No image found at index ${index}`);
      return;
    }
    
    if (!img.complete) {
      console.warn(`Image at index ${index} not complete`);
      return;
    }
    
    if (img.naturalWidth === 0) {
      console.warn(`Image at index ${index} has 0 width (failed to load)`);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    // Cover logic (like object-fit: cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ─── Smooth lerp animation loop ─── */
  useEffect(() => {
    if (!isReady) return;

    const loop = () => {
      const target = Math.round(frameIndex.get());
      const current = currentFrameRef.current;
      const lerped = current + (target - current) * 0.15;
      const rounded = Math.round(lerped);

      if (rounded !== currentFrameRef.current) {
        currentFrameRef.current = rounded;
        drawFrame(rounded);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, frameIndex, drawFrame]);

  /* ─── Draw first frame when ready ─── */
  useEffect(() => {
    if (isReady) {
      console.log("isReady true, drawing first frame");
      drawFrame(0);
    }
  }, [isReady, drawFrame]);

  /* ─── Handle resize ─── */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: "#0a0a0a" }}
        />

        {/* Text overlays */}
        {overlays.map((overlay) => (
          <TextOverlay
            key={overlay.id}
            overlay={overlay}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Text Overlay Component ─── */
function TextOverlay({
  overlay,
  scrollProgress,
}: {
  overlay: Overlay;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [opacity, setOpacity] = useState(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    const { start, end } = overlay;
    const mid = (start + end) / 2;

    if (v < start || v > end) {
      setOpacity(0);
    } else if (v < mid) {
      setOpacity(Math.min(1, (v - start) / (mid - start)));
    } else {
      setOpacity(Math.max(0, 1 - (v - mid) / (end - mid)));
    }
  });

  const alignClass =
    overlay.align === "left"
      ? "items-center justify-start pl-8 md:pl-20"
      : overlay.align === "right"
        ? "items-center justify-end pr-8 md:pr-20"
        : "items-center justify-center";

  return (
    <div
      className={`absolute inset-0 flex ${alignClass} pointer-events-none z-10`}
      style={{ opacity }}
    >
      <div
        className={
          opacity > 0.5 ? "pointer-events-auto" : "pointer-events-none"
        }
      >
        {overlay.content}
      </div>
    </div>
  );
}
