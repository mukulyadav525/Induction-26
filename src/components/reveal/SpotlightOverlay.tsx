"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SpotlightOverlayProps {
  isRevealed: boolean;
}

export default function SpotlightOverlay({
  isRevealed,
}: SpotlightOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const idleGlowRef = useRef<HTMLSpanElement>(null);
  const holeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;
    const idleGlowElement = idleGlowRef.current;
    const holeElement = holeRef.current;
    if (!overlayElement || !idleGlowElement || !holeElement) return;

    if (!isRevealed) {
      gsap.set(overlayElement, { opacity: 1 });
      gsap.set(holeElement, { width: "0%", height: "0%" });
      gsap.set(idleGlowElement, { opacity: 1, top: "50%", left: "50%" });
      const scanTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });
      scanTimeline
        .to(idleGlowElement, { left: "78%", top: "22%", duration: 1.5 }, 0)
        .to(idleGlowElement, { left: "20%", top: "75%", duration: 1.7 }, 1.5)
        .to(idleGlowElement, { left: "60%", top: "55%", duration: 1.3 }, 3.2);
      return () => {
        scanTimeline.kill();
      };
    }

    const revealTimeline = gsap.timeline();
    revealTimeline
      .to(idleGlowElement, { opacity: 0, duration: 0.25 }, 0)
      .to(
        holeElement,
        { width: "220%", height: "220%", filter: "blur(0px)", duration: 0.7, ease: "power2.out" },
        0.05,
      )
      .to(overlayElement, { opacity: 0, duration: 0.3 }, 0.65);

    return () => {
      revealTimeline.kill();
    };
  }, [isRevealed]);

  return (
    <div ref={overlayRef} className="reveal-overlay reveal-overlay-spotlight">
      <span ref={holeRef} className="reveal-spotlight-hole" />
      <span ref={idleGlowRef} className="reveal-spotlight-idle-glow" />
    </div>
  );
}
