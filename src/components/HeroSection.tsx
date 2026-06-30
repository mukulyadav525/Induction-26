"use client";

import { useEffect, useRef, useState } from "react";
import { SCHEDULE_CONFIG, pad } from "@/lib/scheduleEngine";

type CountdownValues = {
  days: string;
  hours: string;
  mins: string;
  secs: string;
};

const INITIAL_COUNTDOWN: CountdownValues = {
  days: "--",
  hours: "--",
  mins: "--",
  secs: "--",
};

export default function HeroSection() {
  const [countdown, setCountdown] =
    useState<CountdownValues>(INITIAL_COUNTDOWN);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function tick() {
      const difference = SCHEDULE_CONFIG.INDUCTION_START.getTime() - Date.now();
      if (difference <= 0) {
        setIsLive(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setCountdown({
        days: pad(Math.floor(difference / 86400000)),
        hours: pad(Math.floor((difference % 86400000) / 3600000)),
        mins: pad(Math.floor((difference % 3600000) / 60000)),
        secs: pad(Math.floor((difference % 60000) / 1000)),
      });
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div
        className="hero-bg-photo"
        aria-hidden="true"
        style={{ backgroundImage: "url('/photos/hero/images.webp')" }}
      />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-title-row">
            <div className="sticker sticker-orange">
              <img
                src="/orange-sticker.svg"
                alt="Handle with care. The future is fragile. IND26-0001"
                className="sticker-orange-bg"
              />
            </div>
            <h1 className="hero-heading">INDUCTION</h1>
            <div className="sticker sticker-lime">
              <img
                src="/lime-sticker.svg"
                alt="Class of 2028, 17 & 18 July 2026"
                className="sticker-lime-bg"
              />
            </div>
          </div>

          <div className="hero-lower">
            <div className="hero-year">&apos;26</div>
            <div className="hero-tagline-block">
              <div className="tagline-rule" />
              <h2 className="hero-tagline">
                A NEW FILE
                <br />
                HAS BEEN OPENED.
              </h2>
              <div className="tagline-rule" />
              <p className="hero-subtext">
                THIS ARCHIVE DOCUMENTS THE ARRIVAL OF A NEW GENERATION AT IIIT
                DELHI — 2 DAYS THAT INTRODUCE YOU TO THE PEOPLE, THE PLACES, AND
                THE TRADITIONS THAT WILL SHAPE THE NEXT FOUR YEARS. WHAT FOLLOWS
                IS NOT JUST AN EVENT. IT IS A DELIBERATE TRANSFER OF CURIOSITY,
                COMMUNITY, AND CULTURE — FROM THOSE WHO CAME BEFORE YOU, TO YOU.
              </p>
            </div>
          </div>
        </div>

        <aside className="hero-sidebar">
          <div className="sidebar-top">
            <div className="sidebar-iiid">IIITD</div>
            <div className="sidebar-inst-name">
              INDRAPRASTHA INSTITUTE OF
              <br />
              INFORMATION TECHNOLOGY, DELHI
            </div>
          </div>
          <div className="sb-rule" />
          <dl className="sidebar-meta">
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M13 2v6h6" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                  <path d="M8 9h2" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>DOCUMENT ID:</dt>
                <dd>IND26-2028</dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>GENERATION:</dt>
                <dd>2026</dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>STATUS:</dt>
                <dd className="status-blink">CONFIRMED</dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-8-7.58-8-12a8 8 0 1 1 16 0c0 4.42-8 12-8 12z" />
                  <circle cx="12" cy="9" r="3" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>LOCATION:</dt>
                <dd>IIIT DELHI</dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M22 12h-4" />
                  <path d="M6 12H2" />
                  <path d="M12 6V2" />
                  <path d="M12 22v-4" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>COORDINATES:</dt>
                <dd>
                  28.5445 N,
                  <br />
                  77.2710 E
                </dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>LAST UPDATED:</dt>
                <dd>17 June 2026</dd>
              </div>
            </div>
            <div className="sm-row">
              <div className="sm-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="sm-text">
                <dt>CLASS SIZE:</dt>
                <dd>~800</dd>
              </div>
            </div>
          </dl>
          <div className="sb-barcode-block">
            <div className="barcode-visual" aria-hidden="true" />
            <div className="barcode-label">INDUCTION 2026</div>
            <div className="barcode-num">2 02620 30260 5</div>
            <div className="barcode-batch">——— BATCH 2026-2028 ———</div>
            <div className="barcode-batch">——— BATCH 2026-2030 ———</div>
          </div>
          <div className="sb-confidential">CONFIDENTIAL WHEN PRINTED</div>
        </aside>
      </div>

      <div className="countdown-strip">
        <div className="countdown-left">
          <span className="cd-label">PG INDUCTION BEGINS IN</span>
          <div className="cd-timer">
            {isLive ? (
              <span className="countdown-live-label">INDUCTION IS LIVE ●</span>
            ) : (
              <>
                <div className="cd-unit">
                  <span>{countdown.days}</span>
                  <span className="cd-lbl">DAYS</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span>{countdown.hours}</span>
                  <span className="cd-lbl">HRS</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span>{countdown.mins}</span>
                  <span className="cd-lbl">MIN</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span>{countdown.secs}</span>
                  <span className="cd-lbl">SEC</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="countdown-right">
          <div className="cd-track-pill">PG TRACK</div>
        </div>
      </div>
    </section>
  );
}
