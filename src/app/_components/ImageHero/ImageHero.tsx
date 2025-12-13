"use client";

import Image, { type StaticImageData } from "next/image";
import { memo, useCallback, useState } from "react";

import Loader from "@/app/_components/Loader";

type ImageHeroProps = {
  src: StaticImageData;
};

const ImageHero = ({ src }: ImageHeroProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  return (
    <>
      {isImageLoading && <Loader isLoading={isImageLoading} />}
      <Image
        alt="backsplash"
        fill
        id="backsplashImage"
        loading="eager"
        onLoad={handleImageLoad}
        placeholder="blur"
        priority
        src={src}
        style={{ objectFit: "cover" }}
      />
    </>
  );
};
export default memo(ImageHero);
