import { useEffect } from "react";

export function useIntersectionObserver<T>(
  data: T[] | undefined,
  setCurrentElement: (value: string) => void,
  getIdFromItem?: (item: T) => string,
) {
  useEffect(() => {
    // Track all currently intersecting sections
    const intersectingElements = new Map<string, IntersectionObserverEntry>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;

        // Skip Next.js elements
        if (
          id === "__next" ||
          id === "__next-build-watcher" ||
          id === "locatorjs-wrapper" ||
          id === "clerk-components"
        ) {
          return;
        }

        // Update tracking map
        if (entry.isIntersecting) {
          intersectingElements.set(id, entry);
        } else {
          intersectingElements.delete(id);
        }
      });

      // Find the topmost visible element
      if (intersectingElements.size > 0) {
        let topmostElement: { id: string; top: number } | null = null;

        intersectingElements.forEach((entry, id) => {
          const top = entry.boundingClientRect.top;
          if (!topmostElement || top < topmostElement.top) {
            topmostElement = { id, top };
          }
        });

        if (topmostElement) {
          setCurrentElement(topmostElement.id);
        }
      } else if (data && data.length > 0 && data[0]) {
        // Fallback to first element if nothing is intersecting
        const firstId = getIdFromItem
          ? getIdFromItem(data[0])
          : String(data[0]);
        setCurrentElement(firstId);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = document.querySelectorAll("[id]");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      intersectingElements.clear();
    };
  }, [data, setCurrentElement, getIdFromItem]);
}
