"use client";

import { useEffect, useRef } from "react";

interface CursorTrailProps {
  points?: number;
  delay?: number;
  strokeWidth?: number;
  color?: string;
}

type Point = { x: number; y: number };

export default function CursorTrail({
  points = 24,
  delay = 25,
  strokeWidth = 2,
  color = "white",
}: CursorTrailProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let target = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const trail: Point[] = Array.from({ length: points }, () => ({
      ...target,
    }));

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    const smoothing = 1 - Math.exp(-16 / delay);

    const buildPath = (pts: Point[]) => {
      if (pts.length < 2) return "";

      let d = `M ${pts[0].x} ${pts[0].y}`;

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;

        d += ` Q ${pts[i].x} ${pts[i].y} ${xc} ${yc}`;
      }

      const last = pts[pts.length - 1];
      d += ` T ${last.x} ${last.y}`;

      return d;
    };

    let raf: number;

    const animate = () => {
      trail[0].x += (target.x - trail[0].x) * smoothing;
      trail[0].y += (target.y - trail[0].y) * smoothing;

      for (let i = 1; i < trail.length; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * smoothing;
        trail[i].y += (trail[i - 1].y - trail[i].y) * smoothing;
      }

      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildPath(trail));
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [points, delay]);

  return (
    <svg
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999999,
        overflow: "visible",
        mixBlendMode: "difference",
      }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: "blur(0.3px)",
          opacity: 0.8,
        }}
      />
    </svg>
  );
}
