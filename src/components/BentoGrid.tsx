"use client";

import { motion } from "motion/react";

const cards = [
  {
    title: "Web Development",
    description: "High-performance web applications built for scale.",
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-[#1a2a00] to-[#0a0a0a]",
    icon: "🌐",
  },
  {
    title: "UI/UX Design",
    description: "Pixel-perfect interfaces that users love.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#0a1a1a] to-[#0a0a0a]",
    icon: "🎨",
  },
  {
    title: "Branding",
    description: "Visual identities that stand the test of time.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#1a0a1a] to-[#0a0a0a]",
    icon: "✦",
  },
  {
    title: "Mobile Apps",
    description: "Native-feeling experiences across all devices.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#0a0a1a] to-[#0a0a0a]",
    icon: "📱",
  },
  {
    title: "AI Integration",
    description: "Smart solutions powered by machine learning.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#1a1a00] to-[#0a0a0a]",
    icon: "🤖",
  },
  {
    title: "Strategy & Consulting",
    description: "Data-driven insights for digital transformation.",
    className: "md:col-span-2 md:row-span-1",
    gradient: "from-[#0a1a0a] to-[#0a0a0a]",
    icon: "📊",
  },
];

export default function BentoGrid() {
  return (
    <section id="bento" className="py-24 md:py-32 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What We Do
        </motion.p>
        <motion.h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Our Capabilities
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`bento-card bg-gradient-to-br ${card.gradient} p-8 flex flex-col justify-between ${card.className}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="text-xl font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-[var(--color-muted)] font-light">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
