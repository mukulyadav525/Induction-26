"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SCHEDULE_CONFIG, pad } from "@/lib/scheduleEngine";
import HeroNoticeButton from "@/components/HeroNoticeButton";
import Reveal from "@/components/Reveal";

type CountdownValues = {
  days: string;
  hours: string;
  mins: string;
  secs: string;
};

type ScheduleBadgeText = {
  label: string;
  event: string | null;
  venue: string | null;
};

type ScheduleApiEvent = {
  time: string;
  endTime: string;
  event: string;
  venue: string;
};

type ScheduleApiDay = {
  dayLabel: string;
  dayIndex: number;
  events: ScheduleApiEvent[];
};

const INITIAL_COUNTDOWN: CountdownValues = {
  days: "--",
  hours: "--",
  mins: "--",
  secs: "--",
};

const INITIAL_BADGE_TEXT: ScheduleBadgeText = {
  label: "LIVE",
  event: null,
  venue: null,
};

function parseTimeToMinutes(value: string): number | null {
  const trimmed = value?.trim();
  if (!trimmed || /^tba$/i.test(trimmed)) return null;

  const decimalMatch = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)$/);
  if (decimalMatch) {
    return Math.round(parseFloat(decimalMatch[1]) * 24 * 60);
  }

  const timeMatch = trimmed.match(/(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!timeMatch) return null;

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2] || "0", 10);
  const ampm = (timeMatch[4] || "").toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function findCurrentOrUpcomingEvent(
  days: ScheduleApiDay[],
  now: Date,
): ScheduleApiEvent | null {
  const startTime = SCHEDULE_CONFIG.INDUCTION_START.getTime();
  const dayOffset = Math.max(
    0,
    Math.floor((now.getTime() - startTime) / (24 * 60 * 60 * 1000)),
  );
  const currentDayIndex = dayOffset;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const candidateEvents: Array<{ dayIndex: number; event: ScheduleApiEvent }> = [];
  for (const day of days) {
    if (day.dayIndex < currentDayIndex) continue;
    for (const event of day.events) {
      candidateEvents.push({ dayIndex: day.dayIndex, event });
    }
  }

  const currentDayEvents = candidateEvents.filter(
    ({ dayIndex }) => dayIndex === currentDayIndex,
  );

  for (const { event } of currentDayEvents) {
    const startMinutes = parseTimeToMinutes(event.time);
    const endMinutes = parseTimeToMinutes(event.endTime);
    if (startMinutes == null) continue;
    if (startMinutes <= nowMinutes && (endMinutes == null || nowMinutes <= endMinutes)) {
      return event;
    }
  }

  const upcomingEvents = currentDayEvents
    .map(({ event }) => ({ event, startMinutes: parseTimeToMinutes(event.time) }))
    .filter((item): item is { event: ScheduleApiEvent; startMinutes: number } =>
      item.startMinutes != null,
    )
    .filter((item) => item.startMinutes >= nowMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (upcomingEvents.length > 0) {
    return upcomingEvents[0].event;
  }

  const laterEvents = candidateEvents
    .map(({ event, dayIndex }) => ({
      event,
      startMinutes: parseTimeToMinutes(event.time),
      dayIndex,
    }))
    .filter(
      (item): item is { event: ScheduleApiEvent; startMinutes: number; dayIndex: number } =>
        item.startMinutes != null,
    )
    .sort((a, b) => a.dayIndex - b.dayIndex || a.startMinutes - b.startMinutes);

  return laterEvents[0]?.event ?? null;
}

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
  const [badgeText, setBadgeText] = useState<ScheduleBadgeText>(INITIAL_BADGE_TEXT);

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
    let isCancelled = false;

    async function loadBadgeText() {
      try {
        const [btechResponse, pgResponse] = await Promise.all([
          fetch("/api/schedule?track=BTECH"),
          fetch("/api/schedule?track=PG"),
        ]);

        if (!btechResponse.ok || !pgResponse.ok) {
          throw new Error("Unable to fetch schedule");
        }

        const [btechData, pgData] = await Promise.all([
          btechResponse.json(),
          pgResponse.json(),
        ]);

        const days: ScheduleApiDay[] = [
          ...(btechData.days ?? []),
          ...(pgData.days ?? []),
        ];

        const event = findCurrentOrUpcomingEvent(days, new Date());
        if (!isCancelled) {
          setBadgeText({
            label: "LIVE",
            event: event?.event ?? null,
            venue: event?.venue ?? null,
          });
        }
      } catch {
        if (!isCancelled) {
          setBadgeText(INITIAL_BADGE_TEXT);
        }
      }
    }

    loadBadgeText();
    const intervalId = window.setInterval(loadBadgeText, 60000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
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

        {isLive ? (
          <div className="hero-live-badge-wrapper">
            <img
              src="/assets/Live/live.webp"
              alt="Live now"
              className="hero-live-badge"
            />
            <div className="hero-live-badge-text">
              {badgeText.event ? (
                <span className="hero-live-badge-event">{badgeText.event}</span>
              ) : null}
              {badgeText.venue ? (
                <span className="hero-live-badge-venue">{badgeText.venue}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grunge-main-sticker-box">
          <img
            ref={mainTitleStickerRef}
            src="/assets/hero/hero_sticker.webp"
            alt="Induction 26 Main Title Banner"
            className="grunge-main-sticker-img"
          />
        </div>

        <div
          className={`grunge-countdown-box ${
            isMobileViewport ? "grunge-top-margin" : ""
          }`}
        >
          {!isLive && (
            <span className="grunge-countdown-label">INDUCTION BEGINS IN</span>
          )}

          <div className="grunge-countdown-card">
            <img
              src="/assets/hero/hero_bottom_sticker.webp"
              alt=""
              className="grunge-countdown-card-bg"
            />
            {!isLive && (
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
            )}

            {/* {isLive && <Reveal />} */}
          </div>
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
