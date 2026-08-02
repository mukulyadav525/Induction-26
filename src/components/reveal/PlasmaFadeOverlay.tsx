"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PlasmaFadeOverlayProps {
  isRevealed: boolean;
}

export default function PlasmaFadeOverlay({
  isRevealed,
}: PlasmaFadeOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const blobCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;
    const blobElements = [blobARef.current, blobBRef.current, blobCRef.current];
    if (!overlayElement || blobElements.some((blob) => !blob)) {
      return;
    }

    if (!isRevealed) {
      gsap.set(overlayElement, { opacity: 1 });
      const idleTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });
      idleTimeline
        .to(blobElements[0], { x: 34, y: -22, scale: 1.25, duration: 2.6 }, 0)
        .to(blobElements[1], { x: -28, y: 24, scale: 1.2, duration: 3 }, 0)
        .to(blobElements[2], { x: 22, y: 26, scale: 1.35, duration: 2.3 }, 0);

      return () => {
        idleTimeline.kill();
      };
    }

    const revealTimeline = gsap.timeline();
    revealTimeline
      .to(
        blobElements,
        { scale: 2.6, opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.06 },
        0,
      )
      .to(overlayElement, { opacity: 0, duration: 0.5 }, 0.2);

    return () => {
      revealTimeline.kill();
    };
  }, [isRevealed]);

  return (
    <div ref={overlayRef} className="reveal-overlay reveal-overlay-plasma">
      <div ref={blobARef} className="reveal-plasma-blob reveal-plasma-blob-a" />
      <div ref={blobBRef} className="reveal-plasma-blob reveal-plasma-blob-b" />
      <div ref={blobCRef} className="reveal-plasma-blob reveal-plasma-blob-c" />
    </div>
  );
}
