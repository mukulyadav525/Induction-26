"use client";

export default function LiveBar() {
  return (
    <div className="live-bar" id="live-bar">
      <div className="live-pill">
        <span className="live-dot"></span>LIVE NOW
      </div>
      <div className="live-content-area" id="live-content">
        <span className="live-placeholder">Connecting to archive...</span>
      </div>
      <div className="live-time-badge" id="live-time"></div>
    </div>
  );
}
