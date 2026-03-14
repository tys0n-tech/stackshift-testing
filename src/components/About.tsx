"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

const PARAGRAPH =
  "We are a digital studio that fuses design, technology, and imagination to build experiences people remember. Our work lives at the intersection of art and engineering — where every detail is intentional and every interaction tells a story.";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = PARAGRAPH.split(" ");

  return (
    <section id="about" ref={containerRef} className="py-32 md:py-48 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.p>

        <p className="text-[clamp(1.5rem,3.5vw,3.5rem)] font-medium leading-[1.3] tracking-[-0.02em]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <motion.span className="inline-block mr-[0.3em]" style={{ opacity }}>
      {word}
    </motion.span>
  );
}
