"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TeamHScrollTrackProps {
  children: React.ReactNode;
  lightVariant?: boolean;
}

export default function TeamHScrollTrack({
  children,
  lightVariant = false,
}: TeamHScrollTrackProps) {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinWrapper = pinWrapperRef.current;
    const track = trackRef.current;
    if (!pinWrapper || !track) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const buildAnimation = () => {
      const totalScrollableWidth = track.scrollWidth - track.offsetWidth;
      if (totalScrollableWidth <= 0) return;

      const horizontalTween = gsap.to(track, {
        x: -totalScrollableWidth,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top 10%",
          end: () => `+=${totalScrollableWidth}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      return horizontalTween;
    };

    let horizontalTween = buildAnimation();

    const onResize = () => {
      if (horizontalTween) {
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
      }
      ScrollTrigger.refresh();
      horizontalTween = buildAnimation();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (horizontalTween) {
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
      }
    };
  }, []);

  return (
    <div
      ref={pinWrapperRef}
      className={`team-hscroll-pin-wrapper${lightVariant ? " team-hscroll-pin-wrapper--light" : ""}`}
    >
      <div
        ref={trackRef}
        className={`team-hscroll-track${lightVariant ? " team-hscroll-track--light" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
