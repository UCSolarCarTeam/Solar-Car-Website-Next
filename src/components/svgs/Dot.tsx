import { memo } from "react";

interface DotProps {
  id: string;
  isActive: boolean;
  distanceFromActive: number;
  handleDotClick: (id: string) => void;
}

const Dot = ({
  distanceFromActive,
  handleDotClick,
  id,
  isActive,
}: DotProps) => {
  const size = Math.max(40, 100 - distanceFromActive * 20);

  return (
    <div
      onClick={() => {
        // scroll to the element with the id
        handleDotClick(id);
      }}
      style={{
        cursor: "pointer",
        transform: `scale(${size / 100})`,
        transition: "all 0.3s ease",
      }}
    >
      <svg
        height="30px"
        style={{
          fill: isActive ? "white" : "rgba(165, 165, 165, 0.8)",
          transition: "all 0.3s ease",
        }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="33" cy="33" r="33" />
      </svg>
    </div>
  );
};

export default memo(Dot);
