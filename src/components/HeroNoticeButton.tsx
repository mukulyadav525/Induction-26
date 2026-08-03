"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { faqItems } from "@/lib/FaqData";
import { ActiveNotice } from "@/lib/noticesDb";

export default function HeroNoticeButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const loudspeakerImgRef = useRef<HTMLImageElement>(null);
  const [activeNotices, setActiveNotices] = useState<ActiveNotice[]>([]);
  const oneHourInMilliseconds = 60 * 60 * 1000;
  const hasRecentNotice = activeNotices.some(
    (notice) => Date.now() - new Date(notice.created_at).getTime() < oneHourInMilliseconds,
  );

  useEffect(() => {
    let didUnmount = false;

    async function loadActiveNotices() {
      try {
        const response = await fetch("/api/notices");
        const data = await response.json();
        if (!didUnmount) setActiveNotices(data.notices ?? []);
      } catch {
        if (!didUnmount) setActiveNotices([]);
      }
    }

    loadActiveNotices();
    return () => {
      didUnmount = true;
    };
  }, []);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    function restoreBackgroundScroll() {
      document.body.style.overflow = "";
    }

    dialogElement.addEventListener("close", restoreBackgroundScroll);
    return () => {
      dialogElement.removeEventListener("close", restoreBackgroundScroll);
      restoreBackgroundScroll();
    };
  }, []);

  useEffect(() => {
    const loudspeakerElement = loudspeakerImgRef.current;
    if (!loudspeakerElement) return;
    gsap.to(loudspeakerElement, { y: 25, duration: 0.75 });
    const shakeTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      defaults: { ease: "power1.inOut" },
    });

    shakeTimeline
      .to(loudspeakerElement, { rotate: -12, duration: 0.08 })
      .to(loudspeakerElement, { rotate: 10, duration: 0.08 })
      .to(loudspeakerElement, { rotate: -8, duration: 0.08 })
      .to(loudspeakerElement, { rotate: 6, duration: 0.08 })
      .to(loudspeakerElement, { rotate: -4, duration: 0.08 })
      .to(loudspeakerElement, { rotate: 0, duration: 0.08 });

    return () => {
      shakeTimeline.kill();
    };
  }, []);

  function openNoticeDialog() {
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }

  function closeNoticeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      closeNoticeDialog();
    }
  }

  return (
    <>
      <button
        type="button"
        className="hero-notice-btn"
        onClick={openNoticeDialog}
        aria-label={
          hasRecentNotice
            ? "Open general notices and FAQ, new notice posted"
            : "Open general notices and FAQ"
        }
      >
        <span
          className={
            hasRecentNotice
              ? "hero-notice-pulse-wrapper hero-notice-pulse-wrapper--active"
              : "hero-notice-pulse-wrapper"
          }
        >
          {hasRecentNotice && (
            <>
              <span className="hero-notice-pulse-ring" />
              <span className="hero-notice-pulse-ring hero-notice-pulse-ring--delayed" />
            </>
          )}
          <img
            ref={loudspeakerImgRef}
            src="/assets/hero/hero_notice_loudspeaker.webp"
            alt=""
            className="hero-notice-btn-img"
          />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="hero-notice-dialog"
        onClick={handleBackdropClick}
        aria-label="General Notices and FAQ"
      >
        <div className="advisory-modal-card">
          <div className="modal-dossier-header">
            <div className="dossier-meta">
              <div className="dossier-stamp">DOCUMENT ID: IND26-FAQ</div>
              <div className="dossier-classification">
                GENERAL NOTICES // FREQUENTLY ASKED QUESTIONS
              </div>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeNoticeDialog}
              aria-label="Close modal"
            >
              ✕ [CLOSE]
            </button>
          </div>

          <div className="modal-divider-rule" />

          <div className="modal-title-row">
            <h2 className="modal-heading">NOTICES & FAQ</h2>
            <p className="modal-subtitle">
              ANSWERS TO COMMON QUESTIONS ABOUT INDUCTION 2026.
            </p>
          </div>

          {activeNotices.length > 0 ? (
            <div className="modal-dossier-grid">
              {activeNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`dossier-memo-box notice-severity-${notice.severity}`}
                >
                  <div className="memo-body">
                    <h3 className="memo-question">{notice.title}</h3>
                    <div className="memo-answer-box">
                      <div className="answer-label">NOTICE:</div>
                      <p className="answer-content">{notice.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dossier-memo-box notice-empty-state">
              <p className="answer-content">
                No notices right now. Enjoy Induction 2026!
              </p>
            </div>
          )}

          <div className="modal-dossier-footer">
            <div className="footer-barcode-section">
              <div className="modal-barcode-visual" aria-hidden="true" />
              <span className="footer-confidential">
                ARCHIVED BY IIIT DELHI INDUCTION TEAM
              </span>
            </div>
            <button
              type="button"
              className="modal-ack-btn"
              onClick={closeNoticeDialog}
            >
              GOT IT
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
