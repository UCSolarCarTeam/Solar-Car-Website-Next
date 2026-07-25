/** Responsive `sizes` values for Next.js `<Image fill />` components. */
export const imageSizes = {
  hero: "100vw",
  pageHero: "100vw",
  carFleet: "(max-width: 768px) 100vw, 600px",
  carCard: "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 400px",
  teamHeadshot: "225px",
  sponsorLogo: "(max-width: 640px) 50vw, 240px",
  ourWorkMedia: "(max-width: 768px) 100vw, 500px",
} as const;

export type ImageSizeKey = keyof typeof imageSizes;

export function imageSize(key: ImageSizeKey): string {
  return imageSizes[key];
}
