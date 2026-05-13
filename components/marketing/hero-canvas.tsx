"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const HeroCameraCanvas = dynamic(
  () => import("@/components/marketing/hero-camera-canvas"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full bg-gradient-to-br from-background via-background to-muted/30"
        aria-hidden
      />
    ),
  },
);

const MAX_BLUR_PX = 14;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export type HeroCanvasProps = {
  children: ReactNode;
  /** Optional id for aria-labelledby on the section */
  headingId?: string;
  className?: string;
};

export function HeroCanvas({ children, headingId, className }: HeroCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const measureProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const topDoc = scrollY + rect.top;
    const sectionHeight = el.offsetHeight;
    const scrollRange = Math.max(1, sectionHeight - vh);
    const p = clamp01((scrollY - topDoc) / scrollRange);
    setScrollProgress(p);
  }, []);

  useLayoutEffect(() => {
    measureProgress();
  }, [measureProgress]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measureProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    const el = sectionRef.current;
    if (el) ro.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [measureProgress]);

  const motionProgress = reducedMotion ? 0 : scrollProgress;
  const blurPx = motionProgress * MAX_BLUR_PX;
  const canvasOpacity = (1 - motionProgress * 0.18) * 0.88;

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-[200vh]", className)}
      aria-labelledby={headingId}
    >
      <div className="sticky top-0 flex min-h-[100dvh] flex-col">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ opacity: canvasOpacity }}
            aria-hidden
          >
            <HeroCameraCanvas
              scrollProgress={scrollProgress}
              reducedMotion={reducedMotion}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/80"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_32%,hsl(var(--background)/0.82)_0%,hsl(var(--background)/0.35)_45%,transparent_70%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/15 to-transparent md:from-background/55 md:via-background/10"
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
              WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full flex-1 flex-col justify-center px-5 py-20 md:py-28">
          {children}
        </div>
      </div>
    </section>
  );
}
