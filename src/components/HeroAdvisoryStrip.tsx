"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ADVISORIES } from "@/lib/heroAdvisoryData";

export default function HeroAdvisoryStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused || isModalOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ADVISORIES.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isModalOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, handleKeyDown]);

  const currentItem = ADVISORIES[activeIndex];

  return (
    <>
      <div
        className="advisory-strip-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="advisory-strip-box">
          <div className="advisory-strip-badge">
            <span className="advisory-pulse-dot" aria-hidden="true" />
            <span className="advisory-badge-text">LIVE DISPATCH</span>
            <span className="advisory-badge-sub">// URGENT MEMOS</span>
          </div>

          <div className="advisory-strip-center">
            <div className="advisory-tabs">
              {ADVISORIES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`advisory-tab-btn ${
                    activeIndex === idx ? "is-active" : ""
                  }`}
                >
                  <span className="tab-idx">[{item.code}]</span>
                  <span className="tab-lbl">{item.tag}</span>
                </button>
              ))}
            </div>

            <div
              className="advisory-ticker-text"
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsModalOpen(true);
                }
              }}
            >
              <span className="ticker-q-hint">Q: {currentItem.question}</span>
              <span className="ticker-arrow">➔</span>
            </div>
          </div>

          <div className="advisory-strip-right">
            <button
              type="button"
              className="advisory-expand-btn"
              onClick={() => setIsModalOpen(true)}
              aria-label="Read full confidential advisory dossier"
            >
              <span>READ DOSSIER</span>
              <span className="expand-icon">↗</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="advisory-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Urgent Admission & Hostel Advisory Dossier"
        >
          <div
            className="advisory-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dossier-header">
              <div className="dossier-meta">
                <div className="dossier-stamp">DOCUMENT ID: IND26-ADV-2026</div>
                <div className="dossier-classification">
                  CLASSIFIED // URGENT ONBOARDING PROTOCOLS
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕ [CLOSE DOSSIER]
              </button>
            </div>

            <div className="modal-divider-rule" />

            <div className="modal-title-row">
              <h2 className="modal-heading">
                MANDATORY STUDENT & PARENT ADVISORY
              </h2>
              <p className="modal-subtitle">
                PLEASE REVIEW THE TWO HIGH-PRIORITY LOGISTICAL DIRECTIVES BELOW
                CONCERNING FEES AND HOSTEL ACCOMMODATION FOR INDUCTION 2026.
              </p>
            </div>

            <div className="modal-dossier-grid">
              {ADVISORIES.map((item, idx) => (
                <div key={item.id} className="dossier-memo-box">
                  <div className="memo-header-strip">
                    <span className="memo-number">
                      0{idx + 1} // {item.code}
                    </span>
                    <span className={`memo-status-chip chip-${item.chipColor}`}>
                      ● {item.statusChip}
                    </span>
                  </div>
                  <div className="memo-body">
                    <h3 className="memo-question">{item.question}</h3>
                    <div className="memo-answer-box">
                      <div className="answer-label">OFFICIAL DIRECTIVE:</div>
                      <p className="answer-content">{item.answerDetail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-dossier-footer">
              <div className="footer-barcode-section">
                <div className="modal-barcode-visual" aria-hidden="true" />
                <span className="footer-confidential">
                  CONFIDENTIAL WHEN PRINTED // ARCHIVED BY IIIT DELHI INDUCTION
                  TEAM
                </span>
              </div>
              <button
                type="button"
                className="modal-ack-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ACKNOWLEDGE & RETRACT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
