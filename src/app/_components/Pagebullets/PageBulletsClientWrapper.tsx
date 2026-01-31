"use client";

import { useCallback, useState } from "react";

import PageBullets from "@/app/_components/Pagebullets";
import { useIntersectionObserver } from "@/app/_hooks/useIntersectionObserver";

interface Props {
  pageIds: string[];
  defaultCurrentId: string;
}

export default function PageBulletsClient({
  defaultCurrentId,
  pageIds,
}: Props) {
  const [currentId, setCurrentId] = useState(defaultCurrentId);

  useIntersectionObserver(pageIds, setCurrentId);

  const handleDotClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <PageBullets
      currentId={currentId}
      handleDotClick={handleDotClick}
      pageIds={pageIds}
    />
  );
}
