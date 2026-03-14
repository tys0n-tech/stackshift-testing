"use client";

import { motion, AnimatePresence } from "motion/react";

export default function Preloader({
  progress,
  isLoaded,
}: {
  progress: number;
  isLoaded: boolean;
}) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[2rem] font-bold tracking-[-0.04em]">
              Stack<span className="text-[var(--color-accent)]">shift</span>
            </div>
          </motion.div>

          <div className="preloader-bar-track">
            <div
              className="preloader-bar-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <motion.p
            className="mt-4 text-sm text-[var(--color-muted)] tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(progress * 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
