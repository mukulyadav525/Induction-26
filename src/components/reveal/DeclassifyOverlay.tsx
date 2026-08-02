"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const redactionBarCount = 7;

interface DeclassifyOverlayProps {
  isRevealed: boolean;
}

export default function DeclassifyOverlay({
  isRevealed,
}: DeclassifyOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scanlineRef = useRef<HTMLSpanElement>(null);
  const sealedStampRef = useRef<HTMLSpanElement>(null);
  const openStampRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;
    const scanlineElement = scanlineRef.current;
    const sealedStampElement = sealedStampRef.current;
    const openStampElement = openStampRef.current;
    const barElements = barRefs.current;
    if (!overlayElement || !scanlineElement || !sealedStampElement || !openStampElement) {
      return;
    }

    if (!isRevealed) {
      gsap.set(overlayElement, { opacity: 1 });
      gsap.set(barElements, { x: 0 });
      gsap.set(sealedStampElement, { opacity: 1, scale: 1 });
      gsap.set(openStampElement, { opacity: 0, scale: 1.4 });
      gsap.set(scanlineElement, { y: "-100%" });
      const scanlineLoop = gsap.to(scanlineElement, {
        y: "400%",
        duration: 3,
        repeat: -1,
        ease: "none",
      });
      return () => {
        scanlineLoop.kill();
      };
    }

    const revealTimeline = gsap.timeline();
    barElements.forEach((barElement, barIndex) => {
      if (!barElement) return;
      const wipesLeft = barIndex % 2 === 0;
      revealTimeline.to(
        barElement,
        { xPercent: wipesLeft ? -105 : 105, duration: 0.45, ease: "power3.in" },
        barIndex * 0.07,
      );
    });
    revealTimeline
      .to(sealedStampElement, { opacity: 0, scale: 0.6, duration: 0.3 }, 0.35)
      .to(
        openStampElement,
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        0.5,
      )
      .to(overlayElement, { opacity: 0, duration: 0.5 }, 1.1);

    return () => {
      revealTimeline.kill();
    };
  }, [isRevealed]);

  return (
    <div ref={overlayRef} className="reveal-overlay reveal-overlay-declassify">
      {Array.from({ length: redactionBarCount }, (_, barIndex) => (
        <span
          key={barIndex}
          ref={(barElement) => {
            barRefs.current[barIndex] = barElement;
          }}
          className="reveal-redaction-bar"
        />
      ))}
      <span ref={scanlineRef} className="reveal-declassify-scanline" />
      <span
        ref={sealedStampRef}
        className="reveal-declassify-stamp reveal-declassify-stamp-sealed"
      >
        CLASSIFIED
      </span>
      <span
        ref={openStampRef}
        className="reveal-declassify-stamp reveal-declassify-stamp-open"
      >
        DECLASSIFIED
      </span>
      <span className="reveal-declassify-status">FILE STATUS: SEALED</span>
    </div>
  );
}
