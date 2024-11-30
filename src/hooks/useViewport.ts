import { useEffect, useState } from "react";

const useViewport = () => {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      window.addEventListener("resize", handleWindowResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowResize);
      }
    };
  }, []);

  return { height, width };
};

export default useViewport;
