import React from "react";

import Arrow from "@/app/_components/svgs/Arrow";

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick?: () => void;
  size?: number;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  ariaLabel,
  direction,
  onClick,
  size = 40,
  style,
}) => {
  return (
    <button
      aria-label={ariaLabel ?? (direction === "left" ? "Previous" : "Next")}
      onClick={onClick}
      style={{
        alignItems: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        padding: 0,
        ...style,
      }}
    >
      <Arrow direction={direction} size={size} />
    </button>
  );
};

export default ArrowButton;
