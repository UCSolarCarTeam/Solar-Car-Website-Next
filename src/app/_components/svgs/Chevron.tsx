import { memo } from "react";

import { type SVGIconProps } from "@/app/_types";

const Chevron = ({ className }: SVGIconProps) => {
  return (
    <svg
      className={className}
      height="25px"
      transform="rotate(90)"
      version="1.1"
      viewBox="0 0 185.343 185.343"
      width="25px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <g>
          <g>
            <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default memo(Chevron);
