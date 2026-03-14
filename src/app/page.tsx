"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});
const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SequenceScroll = dynamic(() => import("@/components/SequenceScroll"), {
  ssr: false,
});
const About = dynamic(() => import("@/components/About"), { ssr: false });
const BentoGrid = dynamic(() => import("@/components/BentoGrid"), {
  ssr: false,
});
const Stats = dynamic(() => import("@/components/Stats"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
});
const CTA = dynamic(() => import("@/components/CTA"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProgress = useCallback((p: number) => {
    setProgress(p);
  }, []);

  const handleLoaded = useCallback(() => {
    // Small delay for polish
    setTimeout(() => setIsLoaded(true), 400);
  }, []);

  return (
    <SmoothScroll>
      <Preloader progress={progress} isLoaded={isLoaded} />
      <Navbar />

      <main>
        {/* Hero — Scroll-linked image sequence */}
        <SequenceScroll
          onLoadProgress={handleProgress}
          onLoaded={handleLoaded}
        />

        {/* Content sections — overlap the canvas end */}
        <div className="-mt-[100vh] relative z-10 bg-[#0a0a0a]">
          <About />
          <BentoGrid />
          <Stats />
          <Testimonials />
          <CTA />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
