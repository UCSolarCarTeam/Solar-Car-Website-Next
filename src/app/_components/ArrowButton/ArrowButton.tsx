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
  direction,
  onClick,
  size = 40,
  style,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || (direction === "left" ? "Previous" : "Next")}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Arrow direction={direction} size={size} />
    </button>
  );
};

export default ArrowButton;
