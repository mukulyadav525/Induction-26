"use client";

import { CSSProperties, useEffect, useMemo, useRef } from "react";

type GalleryPhoto = {
  src: string;
  label: string;
  focalPosition?: string;
};

type MouseScaleGalleryProps = {
  photos: GalleryPhoto[];
};

type GalleryRowProps = {
  left: GalleryPhoto;
  right: GalleryPhoto;
  reversed?: boolean;
  rowIndex: number;
};

type RowLayout = {
  restingLeftWidth: number;
  activeLeftWidth: number;
  leftHeight: string;
  rightHeight: string;
};

const ROW_LAYOUTS: RowLayout[] = [
  {
    restingLeftWidth: 68,
    activeLeftWidth: 44,
    leftHeight: "clamp(320px, 34vw, 460px)",
    rightHeight: "clamp(390px, 44vw, 600px)",
  },
  {
    restingLeftWidth: 40,
    activeLeftWidth: 62,
    leftHeight: "clamp(280px, 28vw, 380px)",
    rightHeight: "clamp(340px, 38vw, 500px)",
  },
  {
    restingLeftWidth: 60,
    activeLeftWidth: 36,
    leftHeight: "clamp(360px, 36vw, 520px)",
    rightHeight: "clamp(240px, 24vw, 340px)",
  },
  {
    restingLeftWidth: 34,
    activeLeftWidth: 58,
    leftHeight: "clamp(240px, 25vw, 340px)",
    rightHeight: "clamp(320px, 32vw, 460px)",
  },
  {
    restingLeftWidth: 64,
    activeLeftWidth: 48,
    leftHeight: "clamp(300px, 30vw, 420px)",
    rightHeight: "clamp(260px, 26vw, 360px)",
  },
  {
    restingLeftWidth: 46,
    activeLeftWidth: 70,
    leftHeight: "clamp(260px, 26vw, 360px)",
    rightHeight: "clamp(340px, 35vw, 500px)",
  },
];

function chunkPhotos(photos: GalleryPhoto[]) {
  const rows: Array<[GalleryPhoto, GalleryPhoto]> = [];

  for (let index = 0; index < photos.length; index += 2) {
    const left = photos[index];
    const right = photos[index + 1] ?? photos[index];
    rows.push([left, right]);
  }

  return rows;
}

function GalleryRow({ left, right, reversed = false, rowIndex }: GalleryRowProps) {
  const rowRef = useRef<HTMLElement | null>(null);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const layout = ROW_LAYOUTS[rowIndex % ROW_LAYOUTS.length];
  const restingLeftWidth = reversed
    ? layout.activeLeftWidth
    : layout.restingLeftWidth;
  const activeLeftWidth = reversed
    ? layout.restingLeftWidth
    : layout.activeLeftWidth;

  useEffect(() => {
    const row = rowRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!row || !leftPanel || !rightPanel) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId = 0;
    let targetProgress = reversed ? 1 : 0;
    let currentProgress = targetProgress;

    const applyProgress = (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const leftWidth =
        restingLeftWidth + (activeLeftWidth - restingLeftWidth) * clampedProgress;
      const rightWidth = 100 - leftWidth;

      leftPanel.style.flexBasis = `${leftWidth}%`;
      rightPanel.style.flexBasis = `${rightWidth}%`;
      row.style.setProperty("--left-width", `${leftWidth}%`);
      row.style.setProperty("--right-width", `${rightWidth}%`);
    };

    applyProgress(currentProgress);

    if (reducedMotion) {
      return;
    }

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.14;
      applyProgress(currentProgress);

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
        applyProgress(currentProgress);
        rafId = 0;
        return;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const queueProgress = (progress: number) => {
      targetProgress = progress;

      if (!rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    const onMove = (event: MouseEvent) => {
      const rect = row.getBoundingClientRect();

      if (!rect.width) {
        return;
      }

      const pointerProgress = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width),
      );

      queueProgress(reversed ? 1 - pointerProgress : pointerProgress);
    };

    const onLeave = () => {
      queueProgress(reversed ? 1 : 0);
    };

    row.addEventListener("mousemove", onMove);
    row.addEventListener("mouseleave", onLeave);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      row.removeEventListener("mousemove", onMove);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [activeLeftWidth, restingLeftWidth, reversed]);

  return (
    <article
      ref={rowRef}
      className={`mouse-scale-row${reversed ? " is-reversed" : ""}`}
      data-row={rowIndex + 1}
      style={{
        ["--left-height" as never]: layout.leftHeight,
        ["--right-height" as never]: layout.rightHeight,
      } as CSSProperties}
    >
      <div ref={leftPanelRef} className="mouse-scale-panel mouse-scale-panel-left">
        <div
          className="mouse-scale-media"
          style={{
            backgroundImage: `url('${left.src}'), url('/photos/gallery/images.webp')`,
            backgroundPosition: left.focalPosition ?? "center",
          }}
        />
        <div className="mouse-scale-meta">
          <span>{String(rowIndex * 2 + 1).padStart(2, "0")}</span>
          <p>{left.label}</p>
        </div>
      </div>

      <div ref={rightPanelRef} className="mouse-scale-panel mouse-scale-panel-right">
        <div
          className="mouse-scale-media"
          style={{
            backgroundImage: `url('${right.src}'), url('/photos/gallery/images.webp')`,
            backgroundPosition: right.focalPosition ?? "center",
          }}
        />
        <div className="mouse-scale-meta">
          <span>{String(rowIndex * 2 + 2).padStart(2, "0")}</span>
          <p>{right.label}</p>
        </div>
      </div>
    </article>
  );
}

export default function MouseScaleGallery({ photos }: MouseScaleGalleryProps) {
  const rows = useMemo(() => chunkPhotos(photos), [photos]);

  return (
    <div className="mouse-scale-gallery reveal">
      {rows.map(([left, right], index) => (
        <GalleryRow
          key={`${left.src}-${right.src}`}
          left={left}
          right={right}
          reversed={index % 2 === 1}
          rowIndex={index}
        />
      ))}
    </div>
  );
}