"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
}: AnimatedSectionProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 40, opacity: 0 };
      case "down":
        return { y: -40, opacity: 0 };
      case "left":
        return { x: 40, opacity: 0 };
      case "right":
        return { x: -40, opacity: 0 };
      case "none":
        return { opacity: 0 };
      default:
        return { y: 40, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
      case "right":
        return { x: 0, opacity: 1 };
      case "none":
        return { opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      viewport={{ once, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Very smooth cubic-bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
