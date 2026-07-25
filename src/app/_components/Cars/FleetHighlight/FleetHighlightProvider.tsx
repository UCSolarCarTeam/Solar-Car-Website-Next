"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const HIGHLIGHT_AFTER_SCROLL_MS = 1200;

type FleetHighlightContextValue = {
  highlightedId: string | null;
  scrollToCar: (id: string) => void;
};

const FleetHighlightContext = createContext<FleetHighlightContextValue | null>(
  null,
);

export function FleetHighlightProvider({ children }: { children: ReactNode }) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smoothScroll = useSmoothScroll();

  function clearHighlightLater() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHighlightedId(null);
      timeoutRef.current = null;
    }, HIGHLIGHT_AFTER_SCROLL_MS);
  }

  function scrollToCar(id: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setHighlightedId(id);

    const scroll = smoothScroll?.scrollTo;
    if (scroll) {
      scroll(id, {
        duration: 1.8,
        offset: -100,
        onComplete: clearHighlightLater,
      });
      return;
    }

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    clearHighlightLater();
  }

  return (
    <FleetHighlightContext.Provider value={{ highlightedId, scrollToCar }}>
      {children}
    </FleetHighlightContext.Provider>
  );
}

export function useFleetHighlight() {
  const ctx = useContext(FleetHighlightContext);
  if (!ctx) {
    throw new Error(
      "useFleetHighlight must be used within FleetHighlightProvider",
    );
  }
  return ctx;
}
