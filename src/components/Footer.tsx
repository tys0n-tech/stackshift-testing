"use client";

import { motion } from "motion/react";

const footerLinks = {
  Services: ["Web Development", "UI/UX Design", "Branding", "Consulting"],
  Company: ["About", "Careers", "Blog", "Contact"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const socials = ["Twitter", "LinkedIn", "Instagram", "GitHub", "Dribbble"];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-20 py-16 md:py-24">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold tracking-[-0.03em] mb-4">
              Stack<span className="text-[var(--color-accent)]">shift</span>
            </h3>
            <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed max-w-[280px]">
              Crafting digital experiences that push boundaries and leave lasting impressions.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
                Stay Updated
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-l-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[#555]"
                />
                <button className="bg-[var(--color-accent)] text-[#0a0a0a] px-5 py-3 rounded-r-lg text-sm font-semibold hover:brightness-110 transition-all cursor-pointer">
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-4">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-link text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Socials */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-4">
              Social
            </p>
            <ul className="space-y-3">
              {socials.map((social) => (
                <li key={social}>
                  <a href="#" className="footer-link text-sm">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Stackshift. All rights reserved.
          </p>
          <motion.button
            className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            whileHover={{ y: -3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
