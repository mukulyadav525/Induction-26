"use client";

interface TeamHScrollTrackProps {
  children: React.ReactNode;
  lightVariant?: boolean;
}

export default function TeamHScrollTrack({
  children,
  lightVariant = false,
}: TeamHScrollTrackProps) {
  return (
    <div
      className={`team-hscroll-pin-wrapper${lightVariant ? " team-hscroll-pin-wrapper--light" : ""}`}
    >
      <div
        className={`team-hscroll-track${lightVariant ? " team-hscroll-track--light" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
