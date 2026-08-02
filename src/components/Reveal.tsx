"use client";

import { useState } from "react";

const REVEALS_DICTIONARY: Record<string, string> = {
  "Opening Performance": "/photos/speakers/speaker-1.webp", //placeholder
  "Sufi Night": "photos/speakers/speaker-1.webp",
  Comedian: "photos/speakers/speaker-1.webp",
  "DJ Night": "photos/speakers/speaker-1.webp",
};

export default function Reveal() {
  const keys = Object.keys(REVEALS_DICTIONARY);
  const [activeKey, setActiveKey] = useState<string>(keys[0] || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (keys.length === 0) return null;

  return (
    <>
      <div className="reveal-container">
        <div className="reveal-badge-wrap">
          <span className="reveal-badge-pre">HERE'S YOUR</span>
          <span className="reveal-badge-title">{activeKey}</span>
        </div>

        <div className="reveal-controls-row">
          {keys.length > 1 && (
            <>
              <div className="reveal-segmented-bar reveal-desktop-only">
                {keys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`reveal-segment-btn ${
                      activeKey === key ? "is-active" : ""
                    }`}
                    onClick={() => setActiveKey(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <select
                className="reveal-mobile-select reveal-mobile-only"
                value={activeKey}
                onChange={(e) => setActiveKey(e.target.value)}
              >
                {keys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            type="button"
            className="reveal-cta-btn"
            onClick={() => setSelectedImage(REVEALS_DICTIONARY[activeKey])}
          >
            <span>REVEAL ARTIST</span>
            <span className="reveal-cta-arrow">→</span>
          </button>
        </div>
      </div>

      {selectedImage && (
        <div
          className="reveal-modal-backdrop"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="reveal-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="reveal-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="reveal-modal-content">
              <span className="reveal-modal-tag">
                {activeKey.toUpperCase()}
              </span>
              <img
                src={selectedImage}
                alt={activeKey}
                className="reveal-modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}