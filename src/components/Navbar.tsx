"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#bento" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#cta" },
];

const SOCIALS = [
  { label: "Twitter / X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "GitHub", href: "#" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="text-xl font-bold tracking-[-0.03em] z-[110]">
          Stack<span className="text-[var(--color-accent)]">shift</span>
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-[110] flex flex-col gap-[6px] cursor-pointer group"
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-7 h-[2px] bg-[var(--color-foreground)]"
            animate={
              isOpen
                ? { rotate: 45, y: 8 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="block w-7 h-[2px] bg-[var(--color-foreground)]"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-7 h-[2px] bg-[var(--color-foreground)]"
            animate={
              isOpen
                ? { rotate: -45, y: -8 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </button>
      </header>

      {/* Fullscreen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu-overlay flex flex-col justify-center"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="px-8 md:px-20 flex-1 flex flex-col justify-center gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={link.href}
                    className="menu-link py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="inline-block overflow-hidden">
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {link.label}
                      </motion.span>
                    </span>
                  </a>
                </motion.div>
              ))}
            </nav>

            {/* Bottom bar of menu */}
            <motion.div
              className="px-8 md:px-20 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-[var(--color-border)] pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
                  Social
                </p>
                <div className="flex gap-6">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">
                  Get in touch
                </p>
                <a
                  href="mailto:hello@stackshift.io"
                  className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  hello@stackshift.io
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
