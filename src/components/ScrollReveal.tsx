"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  threshold?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.1,
  duration = 700,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);

    // For elements already inside viewport on mount (e.g. Hero section), trigger entry animation smoothly on next frame
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getTransitionStyles = () => {
    const base = {
      transitionProperty: "opacity, transform",
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    };

    if (isVisible) {
      return {
        ...base,
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
      };
    }

    switch (direction) {
      case "up":
        return {
          ...base,
          opacity: 0,
          transform: "translate3d(0, 36px, 0)",
        };
      case "down":
        return {
          ...base,
          opacity: 0,
          transform: "translate3d(0, -36px, 0)",
        };
      case "left":
        return {
          ...base,
          opacity: 0,
          transform: "translate3d(36px, 0, 0)",
        };
      case "right":
        return {
          ...base,
          opacity: 0,
          transform: "translate3d(-36px, 0, 0)",
        };
      case "scale":
        return {
          ...base,
          opacity: 0,
          transform: "scale(0.92)",
        };
      case "fade":
      default:
        return {
          ...base,
          opacity: 0,
          transform: "translate3d(0, 24px, 0)",
        };
    }
  };

  return (
    <div ref={ref} style={getTransitionStyles()} className={className}>
      {children}
    </div>
  );
}
