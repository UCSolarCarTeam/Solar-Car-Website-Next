import { useEffect } from "react";

// custom hook that tracks the visible section/DOM elements on the view, used for dot scrolling

export function useIntersectionObserver<T = string>(
  data: T[] | undefined,
  setCurrentElement: (value: string) => void,
  getIdFromItem?: (item: T) => string,
) {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // runs when elements in viewport change
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (
            // filter out Next.js elemenents (don't want these to trigger observer) and default to first element
            id === "__next" ||
            id === "__next-build-watcher" ||
            id === "locatorjs-wrapper" ||
            id === "clerk-components"
          ) {
            if (data && data.length > 0 && data[0]) {
              const firstId = getIdFromItem
                ? getIdFromItem(data[0])
                : String(data[0]);
              setCurrentElement(firstId);
            }
          } else {
            setCurrentElement(id); // set the current element as what is in view
          }
        }
      });
    };

    const observerOptions = {
      root: null, // use browser viewport as parent
      rootMargin: "0px",
      threshold: 0.5, // trigger when 50% of an element is in view
    };

    // create the observer to observe for changes in viewport, trigger callback when 50% of a DOM element is in view
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = document.querySelectorAll("[id]");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element)); // observe the elements
    };
  }, [data, setCurrentElement, getIdFromItem]);
}
