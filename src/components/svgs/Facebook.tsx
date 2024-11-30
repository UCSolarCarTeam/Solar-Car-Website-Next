import { memo } from "react";

import { type SVGIconProps } from "@/types";

const Facebook = ({ className }: SVGIconProps) => {
  return (
    <svg
      fill="none"
      height="29"
      viewBox="0 0 16 29"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3026 28.0766V15.5446H14.7762L15.446 10.6606H10.3025V7.54235C10.3025 6.12832 10.72 5.16474 12.8766 5.16474L15.6271 5.16352V0.795331C15.1513 0.735918 13.5186 0.602905 11.6192 0.602905C7.65354 0.602905 4.93858 2.87891 4.93858 7.0588V10.6606H0.453491V15.5446H4.93858V28.0765H10.3026V28.0766Z"
        fill="white"
      />
    </svg>
  );
};

export default memo(Facebook);
