"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function HeroSection() {
  return (
    <div>
      <motion.h1
        className="font-sans text-5xl sm:text-6xl font-bold tracking-tighter text-fg-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Eshaan Modi
      </motion.h1>

      <motion.div
        className="mt-4 flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="font-mono text-fg-secondary text-sm sm:text-base">
          <span className="text-accent">&gt;</span>{" "}
          <TypingText />
        </span>
      </motion.div>
    </div>
  );
}

function TypingText() {
  const ref = useRef<HTMLSpanElement>(null);
  const text = "electronics engineer · embedded systems · open source";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      if (i < text.length) {
        el.textContent = text.slice(0, ++i);
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <span ref={ref} />
      <span className="cursor-blink text-accent">|</span>
    </>
  );
}
