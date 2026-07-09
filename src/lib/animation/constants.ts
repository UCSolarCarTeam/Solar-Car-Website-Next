/**
 * Animation constants — single source of truth for all
 * timing, easing, and scroll choreography values.
 */

// ── Easings ──────────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

// GSAP string equivalents
export const GSAP_EASE_OUT = "power4.out";
export const GSAP_EASE_CIRC = "circ.out";

// ── Durations (seconds for GSAP, ms for CSS) ─────────────────
export const DUR_FAST = 0.2; // 200ms — micro-interactions
export const DUR_MED = 0.5; // 500ms — section reveals
export const DUR_SLOW = 1.0; // 1000ms — hero transitions
export const DUR_CRAWL = 2.0; // 2000ms — cinematic camera moves

// ── Stagger ──────────────────────────────────────────────────
export const STAGGER_FINE = 0.06;
export const STAGGER_COARSE = 0.12;

// ── Hero scroll sequence breakpoints (0–1 normalised) ────────
export const HERO_STAGE_1_END = 0.33; // photons hit array
export const HERO_STAGE_2_END = 0.66; // energy flows to wheels
export const HERO_STAGE_3_END = 1.0; // solid reveal + camera pull

// ── Particle config ──────────────────────────────────────────
export const PARTICLE_COUNT_DESKTOP = 350;
export const PARTICLE_COUNT_MOBILE = 70;

// ── Team red / amber (match globals.css vars) ─────────────────
export const COLOR_RED = "#C8102E";
export const COLOR_AMBER = "#F5A623";
export const COLOR_WHITE = "#F0EFEC";
export const COLOR_BG = "#0A0A0B";
