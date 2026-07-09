/**
 * GSAP + ScrollTrigger registration helper.
 * Import this module once (in SmoothScrollProvider or a top-level client component)
 * to ensure plugins are registered before any component uses them.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all plugins we use
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Creates a standard pinned hero ScrollTrigger.
 * @param trigger - The element to pin
 * @param onUpdate - Called with progress 0→1 as scroll advances
 */
export function createHeroScrollTrigger(
  trigger: Element,
  onUpdate: (progress: number) => void,
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: 1.2,
    onUpdate: (self) => onUpdate(self.progress),
  });
}

/**
 * Kills all ScrollTrigger instances. Call on component unmount.
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
