import { useCallback } from "react";

const useScrollToElement = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else {
    }
  }, []);

  return scrollToElement;
};

export default useScrollToElement;
