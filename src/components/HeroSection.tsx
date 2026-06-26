"use client";

import { useEffect } from "react";
import { SCHEDULE_CONFIG, pad } from "@/lib/scheduleEngine";

export default function HeroSection() {
  useEffect(() => {
    startCountdown();
  }, []);

  function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;
    function tick() {
      const difference = SCHEDULE_CONFIG.INDUCTION_START.getTime() - Date.now();
      if (difference <= 0) {
        countdownEl!.innerHTML =
          '<span class="countdown-live-label">INDUCTION IS LIVE ●</span>';
        return;
      }
      const daysEl = document.getElementById("cd-days");
      const hoursEl = document.getElementById("cd-hours");
      const minsEl = document.getElementById("cd-mins");
      const secsEl = document.getElementById("cd-secs");
      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference % 86400000) / 3600000);
      const mins = Math.floor((difference % 3600000) / 60000);
      const secs = Math.floor((difference % 60000) / 1000);
      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  return (
    <section className="hero" id="hero">
      <div
        className="hero-bg-photo"
        aria-hidden="true"
        style={{ backgroundImage: "url('/photos/hero/images.png')" }}
      ></div>
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-title-row">
            <div className="sticker sticker-orange" aria-hidden="true">
              <span>HANDLE</span>
              <span>
                WITH <em>+</em>
              </span>
              <span>CARE</span>
              <small>
                THE FUTURE
                <br />
                IS FRAGILE
              </small>
              <div className="sticker-bar-wrap">
                <div className="sticker-bars"></div>
                <span>IND26-0001</span>
              </div>
            </div>
            <h1 className="hero-heading">INDUCTION</h1>
            <div className="sticker sticker-lime" aria-hidden="true">
              <span>CLASS</span>
              <span>OF</span>
              <span className="sticker-big-year">2028 </span>
              <div className="sticker-bar-wrap">
                <div className="sticker-bars"></div>
                <span>17 &amp; 18 July 2026</span>
              </div>
            </div>
          </div>

          <div className="hero-lower">
            <div className="hero-year">&apos;26</div>
            <div className="hero-tagline-block">
              <div className="tagline-rule"></div>
              <h2 className="hero-tagline">
                A NEW FILE
                <br />
                HAS BEEN OPENED.
              </h2>
              <div className="tagline-rule"></div>
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
          <div className="sb-rule"></div>
          <dl className="sidebar-meta">
            <div className="sm-row">
              <dt>DOCUMENT ID:</dt>
              <dd>IND26-2028</dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>GENERATION:</dt>
              <dd>2026</dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>STATUS:</dt>
              <dd className="status-blink" id="hero-status">
                CONFIRMED
              </dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>LOCATION:</dt>
              <dd>IIIT DELHI</dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>COORDINATES:</dt>
              <dd>
                28.5445 N,
                <br />
                77.2710 E
              </dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>LAST UPDATED:</dt>
              <dd>17 June 2026</dd>
            </div>
            <div className="sm-dash"></div>
            <div className="sm-row">
              <dt>CLASS SIZE:</dt>
              <dd>~800</dd>
            </div>
            <div className="sm-dash"></div>
          </dl>
          <div className="sb-barcode-block">
            <div className="barcode-visual" aria-hidden="true"></div>
            <div className="barcode-label">INDUCTION 2026</div>
            <div className="barcode-num">2 02620 30260 5</div>
            <div className="barcode-batch">——— BATCH 2026-2028 ———</div>
            <div className="barcode-batch">——— BATCH 2026-2030 ———</div>
          </div>
          <div className="sb-confidential">CONFIDENTIAL WHEN PRINTED</div>
        </aside>
      </div>

      <div className="countdown-strip">
        <span className="cd-label">PG INDUCTION BEGINS IN</span>
        <div className="cd-timer" id="countdown">
          <div className="cd-unit">
            <span id="cd-days">--</span>
            <span className="cd-lbl">DAYS</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span id="cd-hours">--</span>
            <span className="cd-lbl">HRS</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span id="cd-mins">--</span>
            <span className="cd-lbl">MIN</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span id="cd-secs">--</span>
            <span className="cd-lbl">SEC</span>
          </div>
        </div>
        <div className="cd-track-pill" id="cd-track-pill">
          PG TRACK
        </div>
      </div>
    </section>
  );
}
