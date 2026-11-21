"use client";

import NextImage from "next/image";
import type { ComponentProps } from "react";
import { env } from "@/env";
import { shouldUseSupabase } from "@/lib/image-routing";

/** Shared image entry point; non-selected images retain Next.js's own loader. */
export default function Image(props: ComponentProps<typeof NextImage>) {
  // Optional database fields can contain empty strings as well as null values.
  if (!props.src || (typeof props.src === "string" && !props.src.trim())) {
    return null;
  }

  const useSupabase =
    !props.unoptimized &&
    !props.loader &&
    typeof props.src === "string" &&
    shouldUseSupabase(
      props.src,
      Number(env.NEXT_PUBLIC_SUPABASE_IMAGE_PERCENTAGE ?? 50),
    );

  return (
    <NextImage {...props} unoptimized={props.unoptimized || useSupabase} />
  );
}
