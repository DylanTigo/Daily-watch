import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Flip);

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, Flip, useGSAP };
