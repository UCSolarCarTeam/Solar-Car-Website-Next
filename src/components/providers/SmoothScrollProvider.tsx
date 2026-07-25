"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useReducedMotion from "@/app/_hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ScrollToOptions = {
  duration?: number;
  offset?: number;
  onComplete?: () => void;
};

type SmoothScrollContextValue = {
  scrollTo: (target: string | HTMLElement, options?: ScrollToOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null,
);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    setReady(true);

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
      setReady(false);
    };
  }, [prefersReduced]);

  const scrollApi = useMemo<SmoothScrollContextValue | null>(() => {
    if (!ready) return null;

    return {
      scrollTo: (target, options = {}) => {
        const { duration = 1.8, offset = -120, onComplete } = options;
        const element =
          typeof target === "string" ? document.getElementById(target) : target;

        if (!element) return;

        const lenis = lenisRef.current;
        if (lenis && !prefersReduced) {
          lenis.scrollTo(element, { duration, offset, onComplete });
          return;
        }

        const top =
          element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ behavior: "smooth", top });
        onComplete?.();
      },
    };
  }, [prefersReduced, ready]);

  return (
    <SmoothScrollContext.Provider value={scrollApi}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
