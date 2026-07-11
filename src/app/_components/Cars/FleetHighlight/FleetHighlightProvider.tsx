"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

const HIGHLIGHT_DURATION_MS = 1500;

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

  function scrollToCar(id: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setHighlightedId(id);

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });

    timeoutRef.current = setTimeout(() => {
      setHighlightedId(null);
      timeoutRef.current = null;
    }, HIGHLIGHT_DURATION_MS);
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
