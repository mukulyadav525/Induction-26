"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ParsedDay,
  ParsedEvent,
  pad,
  formatTimeDisplay,
  SCHEDULE_CONFIG,
} from "@/lib/scheduleEngine";
import { Track } from "@/lib/scheduleEngine";
import { FetchScheduleResult } from "@/lib/fetchScheduleRows";

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  TALK: { bg: "#B5FF37", fg: "#121212" },
  KEYNOTE: { bg: "#B5FF37", fg: "#121212" },
  WORKSHOP: { bg: "#FF530D", fg: "#ffffff" },
  CULTURAL: { bg: "#A000D3", fg: "#ffffff" },
  ADMIN: { bg: "#4765FF", fg: "#ffffff" },
  ORIENTATION: { bg: "#4765FF", fg: "#ffffff" },
  SPORTS: { bg: "#008A8A", fg: "#ffffff" },
  MEAL: { bg: "#FF530D", fg: "#ffffff" },
  BREAK: { bg: "#666666", fg: "#ffffff" },
  TOUR: { bg: "#008A8A", fg: "#ffffff" },
  LECTURE: { bg: "#B5FF37", fg: "#121212" },
  CEREMONY: { bg: "#A000D3", fg: "#ffffff" },
};
const DEFAULT_TYPE_COLOR = { bg: "#888888", fg: "#ffffff" };

const POSTIT_COLORS = [
  { bg: "#B5FF37", fg: "#121212" },
  { bg: "#FF530D", fg: "#ffffff" },
  { bg: "#4765FF", fg: "#ffffff" },
  { bg: "#A000D3", fg: "#ffffff" },
  { bg: "#008A8A", fg: "#ffffff" },
];

function typeColor(type: string) {
  return TYPE_COLORS[type?.toUpperCase()?.trim()] || DEFAULT_TYPE_COLOR;
}

// Computes the calendar date for a given dayIndex, based on the induction
// start date. Using dayIndex directly (rather than searching for a day's
// position in an array of labels) means this can't drift out of sync if
// days are ever returned out of order.
function dayIndexToDate(dayIndex: number): Date {
  const start = SCHEDULE_CONFIG.INDUCTION_START;
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + dayIndex,
  );
}

function dayLabelToDate(day: ParsedDay): Date | null {
  if (!day) return null;
  return dayIndexToDate(day.dayIndex);
}

function parseEventTime(timeStr: string, dateObj: Date | null): Date | null {
  if (!timeStr) return null;
  const asDecimal = parseFloat(timeStr);
  if (!isNaN(asDecimal) && asDecimal > 0 && asDecimal < 1) {
    const totalMinutes = Math.round(asDecimal * 24 * 60);
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const base = dateObj ?? new Date();
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hour,
      minute,
      0,
    );
  }
  const match = timeStr
    .trim()
    .toUpperCase()
    .match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3];
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const base = dateObj ?? new Date();
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hour,
    minute,
    0,
  );
}

function formatClockTime(date: Date | null): string {
  if (!date) return "—";
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${pad(minute)} ${ampm}`;
}

function getDefaultDayIndex(days: ParsedDay[]): number {
  if (days.length === 0) return 0;
  const todayStr = new Date().toDateString();

  const todayMatch = days.find((day) => {
    const dateObj = dayLabelToDate(day);
    return dateObj && dateObj.toDateString() === todayStr;
  });
  if (todayMatch) return todayMatch.dayIndex;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcoming = days.find((day) => {
    const dateObj = dayLabelToDate(day);
    return dateObj && dateObj >= startOfToday;
  });
  if (upcoming) return upcoming.dayIndex;

  return days[0].dayIndex;
}

interface EventRowProps {
  event: ParsedEvent;
  dayIndex: number;
  now: Date;
  index: number;
}

function EventRow({ event, dayIndex, now, index }: EventRowProps) {
  const dateObj = dayIndexToDate(dayIndex);
  const startTime = parseEventTime(event.time, dateObj);
  const endTime = event.endTime
    ? parseEventTime(event.endTime, dateObj)
    : startTime
      ? new Date(startTime.getTime() + 3600000)
      : null;

  const isCurrentlyLive =
    startTime && endTime && startTime <= now && now < endTime;
  const hasNoEvent = !event.event || /^tba$/i.test(event.event.trim());

  const tc = event.type ? typeColor(event.type) : null;

  let badgeText = "CONFIRMED";
  if (isCurrentlyLive) badgeText = "● LIVE NOW";
  else if (event.status === "TENTATIVE" || event.status === "TBD") badgeText = "TENTATIVE";
  else if (event.status === "OPEN") badgeText = "OPEN";

  const accentColor = tc ? tc.bg : "#888888";

  return (
    <div
      className={`cream-row-item${isCurrentlyLive ? " is-live-entry" : ""}`}
      style={{
        borderLeft: `6px solid ${accentColor}`,
        paddingLeft: "1.25rem",
        animationDelay: `${index * 0.03}s`,
      }}
    >
      <div className="cream-time">
        <span className="cream-time-start">
          {formatTimeDisplay(event.time) || "—"}
        </span>
        <span className="cream-time-end">
          {formatClockTime(endTime)}
        </span>
      </div>

      <div className="cream-content">
        {tc && event.type && (
          <span
            className="cream-type-chip"
            style={{ background: tc.bg, color: tc.fg }}
          >
            {event.type}
          </span>
        )}
        <div className="cream-event-name">
          {hasNoEvent ? "Details to be announced" : event.event}
        </div>
        {event.venue && (
          <div className="cream-meta">
            ▸ {[event.venue, event.speaker].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>

      <div className="cream-status-badge">
        {badgeText}
      </div>
    </div>
  );
}

interface LiveBarComputedProps {
  days: ParsedDay[];
  now: Date;
}

function computeLiveBarState(props: LiveBarComputedProps) {
  const { days, now } = props;

  let currentSession: {
    event: ParsedEvent;
    dayLabel: string;
    end: Date;
  } | null = null;
  let nextSession: {
    event: ParsedEvent;
    dayLabel: string;
    start: Date;
  } | null = null;

  for (const day of days) {
    const dateObj = dayLabelToDate(day);
    for (const event of day.events) {
      const start = parseEventTime(event.time, dateObj);
      if (!start) continue;
      const end = event.endTime
        ? parseEventTime(event.endTime, dateObj)
        : new Date(start.getTime() + 3600000);
      if (start <= now && end && now < end && !currentSession) {
        currentSession = { event, dayLabel: day.dayLabel, end };
      } else if (start > now && !nextSession) {
        nextSession = { event, dayLabel: day.dayLabel, start };
      }
    }
  }

  return { currentSession, nextSession };
}

interface ScheduleViewProps {
  initialDays: ParsedDay[];
  initialFetchedAt: string;
  track: Track;
  dates: Array<String>;
  error: string | null;
}

export default function ScheduleView({
  initialDays,
  initialFetchedAt,
  track,
  dates,
  error: initialError,
}: ScheduleViewProps) {
  const [scheduleDays, setScheduleDays] = useState<ParsedDay[]>(initialDays);
  const [fetchError, setFetchError] = useState<string | null>(initialError);
  const [lastRefreshed, setLastRefreshed] = useState<string>(() => {
    const date = new Date(initialFetchedAt);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} IST`;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [activeDayIndex, setActiveDayIndex] = useState<number>(() =>
    getDefaultDayIndex(initialDays),
  );
  const refreshIconRef = useRef<HTMLSpanElement>(null);
  const doRefreshRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (scheduleDays.length === 0) return;
    const stillExists = scheduleDays.some(
      (d) => d.dayIndex === activeDayIndex,
    );
    if (!stillExists) {
      setActiveDayIndex(scheduleDays[0].dayIndex);
    }
  }, [scheduleDays, activeDayIndex]);

  const doRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (refreshIconRef.current) {
      refreshIconRef.current.style.animation = "spin .7s linear infinite";
    }
    try {
      const response = await fetch(`/api/schedule?track=${track}`);
      const result: FetchScheduleResult = await response.json();
      setScheduleDays(result.days);
      setFetchError(result.error);
      const refreshDate = new Date(result.fetchedAt);
      setLastRefreshed(
        `${pad(refreshDate.getHours())}:${pad(refreshDate.getMinutes())}:${pad(refreshDate.getSeconds())} IST`,
      );
    } catch {
      setFetchError("Network error — could not reach schedule.");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        if (refreshIconRef.current) {
          refreshIconRef.current.style.animation = "";
        }
      }, 1400);
    }
  }, [isRefreshing, track]);

  doRefreshRef.current = doRefresh;

  useEffect(() => {
    doRefreshRef.current();
    const autoRefreshInterval = setInterval(
      () => doRefreshRef.current(),
      SCHEDULE_CONFIG.REFRESH_EVERY_MS,
    );
    return () => clearInterval(autoRefreshInterval);
  }, []);

  const { currentSession, nextSession } = computeLiveBarState({
    days: scheduleDays,
    now,
  });

  let liveBarContent: React.ReactNode;
  let liveTimeText = "";
  let liveBarIsActive = false;

  if (currentSession) {
    const eventName = currentSession.event.event || "Current Session";
    const venueValue = currentSession.event.venue;
    const speakerValue = currentSession.event.speaker;
    liveBarContent = (
      <>
        <span className="live-event-name">{eventName}</span>
        {venueValue && <span className="live-meta">@ {venueValue}</span>}
        {speakerValue && <span className="live-meta">— {speakerValue}</span>}
      </>
    );
    liveTimeText = `Until ${pad(currentSession.end.getHours())}:${pad(currentSession.end.getMinutes())}`;
    liveBarIsActive = true;
  } else if (nextSession) {
    const eventName = nextSession.event.event || "Next Session";
    liveBarContent = (
      <>
        <span className="live-up-label">UP NEXT —</span>{" "}
        <span className="live-event-name">{eventName}</span>
      </>
    );
    liveTimeText = `at ${pad(nextSession.start.getHours())}:${pad(nextSession.start.getMinutes())}`;
  } else {
    liveBarContent = (
      <span className="live-idle">
        No active session right now — check the schedule for upcoming events.
      </span>
    );
  }

  const activeDay =
    scheduleDays.find((d) => d.dayIndex === activeDayIndex) ??
    scheduleDays[0] ??
    null;

  const activePalette = POSTIT_COLORS[activeDayIndex % POSTIT_COLORS.length] || POSTIT_COLORS[0];

  return (
    <>
      <div
        className={`live-bar${liveBarIsActive ? " is-live" : ""}`}
        id="live-bar"
      >
        <div className="live-pill">
          <span className="live-dot"></span>LIVE NOW
        </div>
        <div className="live-content-area" id="live-content">
          {liveBarContent}
        </div>
        <div className="live-time-badge" id="live-time">
          {liveTimeText}
        </div>
      </div>

      <section className="sec-schedule sched-page-body" id="schedule">
        <div className="container" style={{ maxWidth: "1150px", margin: "0 auto", padding: "0 1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0 1.25rem 0",
              fontFamily: "var(--ff-mono)",
              fontSize: "0.8rem",
              color: "#555555",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="spm-badge-cream">LIVE SYNC</span>
              <span>
                Schedule syncs automatically from the master sheet · Last refreshed:{" "}
                <strong style={{ color: "#121212" }}>{lastRefreshed}</strong>
              </span>
            </div>
            <button
              className="refresh-btn brutal-sync-btn"
              onClick={doRefresh}
              disabled={isRefreshing}
            >
              <span ref={refreshIconRef}>↻</span> SYNC
            </button>
          </div>

          <div className="notebook-outer-container">
            <main id="schedule-body" className="cream-page-body" key={activeDay?.dayLabel ?? "empty"}>
              {fetchError ? (
                <div style={{ color: "#FF530D", padding: "2rem", fontWeight: 700, fontFamily: "var(--ff-mono)" }}>
                  Connection issue — could not reach schedule.
                </div>
              ) : scheduleDays.length === 0 || !activeDay ? (
                <div style={{ color: "#666666", padding: "2rem", fontWeight: 700, fontFamily: "var(--ff-mono)" }}>
                  Schedule pending...
                </div>
              ) : (
                <>
                  <div
                    className="cream-header-banner"
                    style={{
                      background: activePalette.bg,
                      color: activePalette.fg,
                    }}
                  >
                    <span className="cream-day-title">
                      DAY {String((activeDay?.dayIndex ?? 0) + 1).padStart(2, "0")}
                    </span>
                    <span className="cream-day-date">
                      {dates[activeDay?.dayIndex ?? 0]}
                    </span>
                  </div>

                  <div className="cream-entries-list">
                    {activeDay.events.length === 0 ? (
                      <div style={{ color: "#666666", padding: "1.25rem 1.75rem", fontWeight: 700, fontFamily: "var(--ff-mono)" }}>
                        NO EVENTS LISTED YET
                      </div>
                    ) : (
                      activeDay.events.map((event, eventIndex) => (
                        <EventRow
                          key={eventIndex}
                          index={eventIndex}
                          event={event}
                          dayIndex={activeDay.dayIndex}
                          now={now}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </main>

            {scheduleDays.length > 0 && (
              <aside className="side-postit-stack" role="tablist" aria-label="Select Day Bookmark">
                {scheduleDays.map((day, idx) => {
                  const isActive = day.dayIndex === activeDayIndex;
                  const palette = POSTIT_COLORS[idx % POSTIT_COLORS.length];

                  return (
                    <button
                      key={day.dayLabel}
                      role="tab"
                      aria-selected={isActive}
                      className={`postit-side-btn${isActive ? " is-active" : ""}`}
                      onClick={() => setActiveDayIndex(day.dayIndex)}
                      style={{
                        background: palette.bg,
                        color: palette.fg,
                      }}
                    >
                      <span>DAY {String(day.dayIndex + 1).padStart(2, "0")}</span>
                      <span className="postit-btn-date">{dates[day.dayIndex]}</span>
                    </button>
                  );
                })}
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}