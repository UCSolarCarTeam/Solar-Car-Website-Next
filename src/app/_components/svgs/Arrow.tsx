import React from "react";

interface ArrowProps {
  direction: "left" | "right";
  size?: number;
}

const Arrow: React.FC<ArrowProps> = ({ direction, size = 40 }) => {
  const isLeft = direction === "left";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="20"
        cy="20"
        r="19"
        stroke="#222"
        strokeWidth="2"
        fill="#fff"
      />
      <path
        d={isLeft ? "M24 12L16 20L24 28" : "M16 12L24 20L16 28"}
        stroke="#222"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Arrow;
