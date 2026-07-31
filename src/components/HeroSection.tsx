"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SCHEDULE_CONFIG, pad } from "@/lib/scheduleEngine";
import HeroNoticeButton from "@/components/HeroNoticeButton";

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
  const heroSectionContainerRef = useRef<HTMLElement>(null);
  const mainTitleStickerRef = useRef<HTMLImageElement>(null);
  const bottomThreeQuotesRef = useRef<HTMLImageElement>(null);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(
    null,
  );
  const [countdown, setCountdown] =
    useState<CountdownValues>(INITIAL_COUNTDOWN);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    function tick() {
      const difference = SCHEDULE_CONFIG.INDUCTION_START.getTime() - Date.now();
      if (difference <= 0) {
        setIsLive(true);
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
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const animationTimeline = gsap.timeline({
      defaults: { ease: "power3.out" },
    });
    setIsMobileViewport(window.innerWidth <= 640);
    const threeQuotesOffscreenX = window.innerWidth * -0.186;
    const threeQuotesRestingX = window.innerWidth * -0.065;

    animationTimeline.fromTo(
      mainTitleStickerRef.current,
      { opacity: 0, scale: 0, y: -120, rotate: 359 },
      {
        opacity: 1,
        scale: 1,
        y: window.innerWidth <= 640 ? 75 : 0,
        duration: 0.9,
        rotate: 0,
      },
    );

    animationTimeline.fromTo(
      bottomThreeQuotesRef.current,
      { opacity: 0, x: threeQuotesOffscreenX },
      { opacity: 1, x: threeQuotesRestingX, duration: 0.7 },
      "-=0.6",
    );
  }, []);

  return (
    <section ref={heroSectionContainerRef} className="grunge-hero-section">
      <img
        src="/assets/hero/hero_bg.webp"
        alt="Induction Background Wallpaper"
        className="grunge-hero-wallpaper"
      />
      <div className="landing">
        <HeroNoticeButton />

        <div className="grunge-main-sticker-box">
          <img
            ref={mainTitleStickerRef}
            src="/assets/hero/hero_sticker.webp"
            alt="Induction 26 Main Title Banner"
            className="grunge-main-sticker-img"
          />
        </div>

        <div
          className={`grunge-countdown-box ${isMobileViewport ? "grunge-top-margin" : ""}`}
        >
          <span className="grunge-countdown-label">
            {isLive ? "INDUCTION IS LIVE ●" : "INDUCTION BEGINS IN"}
          </span>
          {!isLive && (
            <div className="grunge-countdown-card">
              <img
                src="/assets/hero/hero_bottom_sticker.webp"
                alt=""
                className="grunge-countdown-card-bg"
              />
              <div className="grunge-countdown-timer">
                <div className="grunge-countdown-unit">
                  <span className="grunge-countdown-num">{countdown.days}</span>
                  <span className="grunge-countdown-lbl">DAYS</span>
                </div>
                <span className="grunge-countdown-sep">:</span>
                <div className="grunge-countdown-unit">
                  <span className="grunge-countdown-num">
                    {countdown.hours}
                  </span>
                  <span className="grunge-countdown-lbl">HRS</span>
                </div>
                <span className="grunge-countdown-sep">:</span>
                <div className="grunge-countdown-unit">
                  <span className="grunge-countdown-num">{countdown.mins}</span>
                  <span className="grunge-countdown-lbl">MIN</span>
                </div>
                <span className="grunge-countdown-sep">:</span>
                <div className="grunge-countdown-unit">
                  <span className="grunge-countdown-num">{countdown.secs}</span>
                  <span className="grunge-countdown-lbl">SEC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="grunge-footer-area">
          <div className="grunge-three-quotes-box">
            <img
              ref={bottomThreeQuotesRef}
              src="/assets/hero/hero_three_quotes.webp"
              alt="New People New Experiences Endless Possibilities"
              className="grunge-three-quotes-img"
            />
          </div>

          <div className="grunge-smiley-box">
            <img
              src="/assets/hero/hero_smilie_badge.webp"
              alt="Induction 26 IIIT Delhi Smiley Seal Badge"
              className="grunge-smiley-img"
            />
          </div>
        </footer>
      </div>
    </section>
  );
}
