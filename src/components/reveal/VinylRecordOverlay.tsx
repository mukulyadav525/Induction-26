"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface VinylRecordOverlayProps {
  isRevealed: boolean;
}

export default function VinylRecordOverlay({
  isRevealed,
}: VinylRecordOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const tonearmRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;
    const discElement = discRef.current;
    const tonearmElement = tonearmRef.current;
    const flashElement = flashRef.current;
    if (!overlayElement || !discElement || !tonearmElement || !flashElement) {
      return;
    }

    if (!isRevealed) {
      gsap.set(overlayElement, { opacity: 1 });
      gsap.set(discElement, { x: 0, scale: 1, rotate: 0 });
      gsap.set(tonearmElement, { rotate: 0 });
      const spinTween = gsap.to(discElement, {
        rotation: "+=360",
        duration: 2.6,
        repeat: -1,
        ease: "none",
      });
      return () => {
        spinTween.kill();
      };
    }

    const revealTimeline = gsap.timeline();
    revealTimeline
      .fromTo(
        flashElement,
        { opacity: 0.9 },
        { opacity: 0, duration: 0.3, ease: "power1.out" },
        0,
      )
      .to(tonearmElement, { rotate: -35, duration: 0.4, ease: "power2.out" }, 0)
      .to(
        discElement,
        { x: "160%", rotation: "+=50", scale: 0.72, duration: 0.6, ease: "power2.in" },
        0.05,
      )
      .to(overlayElement, { opacity: 0, duration: 0.4 }, 0.42);

    return () => {
      revealTimeline.kill();
    };
  }, [isRevealed]);

  return (
    <div ref={overlayRef} className="reveal-overlay reveal-overlay-vinyl">
      <span ref={flashRef} className="reveal-vinyl-flash" />
      <div ref={discRef} className="reveal-vinyl-disc">
        <span className="reveal-vinyl-blur-ring" />
        <span className="reveal-vinyl-blur-ring" />
        <span className="reveal-vinyl-blur-ring" />
        <span className="reveal-vinyl-groove" />
        <span className="reveal-vinyl-groove" />
        <span className="reveal-vinyl-groove" />
        <span className="reveal-vinyl-label" />
      </div>
      <span ref={tonearmRef} className="reveal-vinyl-tonearm" />
    </div>
  );
}
