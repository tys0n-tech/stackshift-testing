"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const testimonials = [
  {
    quote:
      "Stackshift transformed our digital presence entirely. The attention to detail and creative direction exceeded every expectation we had.",
    name: "Sarah Chen",
    role: "CEO, Luminex",
    avatar: "SC",
  },
  {
    quote:
      "Working with them felt like having a superpower. They delivered a product so impressive it became our strongest sales tool.",
    name: "Marcus Rivera",
    role: "Founder, Nexus Labs",
    avatar: "MR",
  },
  {
    quote:
      "Their team doesn't just build websites — they craft digital experiences. The level of polish is simply unmatched in the industry.",
    name: "Elena Kowalski",
    role: "Creative Director, Prism",
    avatar: "EK",
  },
  {
    quote:
      "From concept to launch, every phase was handled with absolute precision. Our conversion rate tripled in the first month.",
    name: "David Park",
    role: "VP Marketing, Forge AI",
    avatar: "DP",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="py-24 md:py-40 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto text-center relative min-h-[400px] flex flex-col items-center justify-center">
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Testimonials
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <blockquote className="text-[clamp(1.25rem,2.5vw,2.25rem)] font-light leading-[1.4] tracking-[-0.01em] mb-10">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-[#0a0a0a] flex items-center justify-center font-bold text-sm">
                {t.avatar}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "bg-[var(--color-accent)] w-6"
                  : "bg-[var(--color-border)] hover:bg-[var(--color-muted)]"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
