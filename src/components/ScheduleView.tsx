"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ParsedDay,
  ParsedEvent,
  pad,
  formatTimeDisplay,
  readColumn,
  ScheduleRow,
  SCHEDULE_CONFIG,
} from "@/lib/scheduleEngine";
import { Track } from "@/lib/scheduleEngine";
import { FetchScheduleResult } from "@/lib/fetchScheduleRows";

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  TALK: { bg: "#c8f135", fg: "#1a1a1a" },
  KEYNOTE: { bg: "#c8f135", fg: "#1a1a1a" },
  WORKSHOP: { bg: "#e85d04", fg: "#ffffff" },
  CULTURAL: { bg: "#9d4edd", fg: "#ffffff" },
  ADMIN: { bg: "#3a86ff", fg: "#1a1a1a" },
  ORIENTATION: { bg: "#3a86ff", fg: "#ffffff" },
  SPORTS: { bg: "#06d6a0", fg: "#1a1a1a" },
  MEAL: { bg: "#fb5607", fg: "#ffffff" },
  BREAK: { bg: "#444444", fg: "#ffffff" },
  TOUR: { bg: "#118ab2", fg: "#ffffff" },
  LECTURE: { bg: "#c8f135", fg: "#1a1a1a" },
  CEREMONY: { bg: "#9d4edd", fg: "#ffffff" },
};
const DEFAULT_TYPE_COLOR = { bg: "#555555", fg: "#ffffff" };

function typeColor(type: string) {
  return TYPE_COLORS[type?.toUpperCase()?.trim()] || DEFAULT_TYPE_COLOR;
}

function dayLabelToDate(dayLabel: string, allDayLabels: string[]): Date | null {
  const dayIndex = allDayLabels.indexOf(dayLabel);
  if (dayIndex < 0) return null;
  const start = SCHEDULE_CONFIG.INDUCTION_START;
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + dayIndex,
  );
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

interface EventRowProps {
  event: ParsedEvent;
  allDayLabels: string[];
  dayLabel: string;
  now: Date;
}

function EventRow({ event, allDayLabels, dayLabel, now }: EventRowProps) {
  const dateObj = dayLabelToDate(dayLabel, allDayLabels);
  const startTime = parseEventTime(event.time, dateObj);
  const endTime = event.endTime
    ? parseEventTime(event.endTime, dateObj)
    : startTime
      ? new Date(startTime.getTime() + 3600000)
      : null;

  const isCurrentlyLive =
    startTime && endTime && startTime <= now && now < endTime;
  const isTBA = !event.time || /^tba$/i.test(event.time.trim());
  const hasNoEvent = !event.event || /^tba$/i.test(event.event.trim());

  const tc = event.type ? typeColor(event.type) : null;

  let badgeClass = "dbe-badge--open";
  let badgeText = "OPEN";
  if (
    event.status === "CONFIRMED" ||
    event.type === "KEYNOTE" ||
    event.type === "ORIENTATION"
  ) {
    badgeClass = "dbe-badge--confirmed";
    badgeText = "CONFIRMED";
  } else if (event.status === "TENTATIVE" || event.status === "TBD") {
    badgeClass = "dbe-badge--tentative";
    badgeText = "TENTATIVE";
  }
  if (isCurrentlyLive) {
    badgeClass = "dbe-badge--live";
    badgeText = "● LIVE";
  }

  const leftBorderColor = isCurrentlyLive
    ? "#c8f135"
    : tc
      ? tc.bg
      : "transparent";

  return (
    <div
      className={`dbe-row${hasNoEvent ? " is-pending" : ""}${isCurrentlyLive ? " is-live-row" : ""}`}
      style={{ borderLeft: `4px solid ${leftBorderColor}` }}
    >
      <div className={`dbe-time${isTBA ? " is-tba" : ""}`}>
        {formatTimeDisplay(event.time) || "—"}
      </div>
      <div className="dbe-info">
        {tc && event.type && (
          <span
            className="dbe-type-chip"
            style={{ background: tc.bg, color: tc.fg }}
          >
            {event.type}
          </span>
        )}
        <div className={`dbe-name${hasNoEvent ? " is-tba" : ""}`}>
          {hasNoEvent ? "Details to be announced" : event.event}
        </div>
        {event.venue && <div className="dbe-venue">{event.venue}</div>}
      </div>
      <div className={`dbe-badge ${badgeClass}`}>{badgeText}</div>
    </div>
  );
}

interface LiveBarComputedProps {
  rows: ScheduleRow[];
  allDayLabels: string[];
  now: Date;
}

function computeLiveBarState(props: LiveBarComputedProps) {
  const { rows, allDayLabels, now } = props;

  let currentSession: { row: ScheduleRow; end: Date } | null = null;
  let nextSession: { row: ScheduleRow; start: Date } | null = null;

  for (const row of rows) {
    const dayLabel = readColumn(row, "Day", "day", "Date", "date").trim();
    const dateObj = dayLabelToDate(dayLabel, allDayLabels);
    const timeStr = readColumn(
      row,
      "Time",
      "time",
      "Start Time",
      "start_time",
    ).trim();
    const endStr = readColumn(
      row,
      "End Time",
      "end_time",
      "EndTime",
      "End",
    ).trim();

    const start = parseEventTime(timeStr, dateObj);
    if (!start) continue;

    const end = endStr
      ? parseEventTime(endStr, dateObj)
      : new Date(start.getTime() + 3600000);

    if (start <= now && end && now < end && !currentSession) {
      currentSession = { row, end };
    } else if (start > now && !nextSession) {
      nextSession = { row, start };
    }
  }

  return { currentSession, nextSession };
}

interface ScheduleViewProps {
  initialDays: ParsedDay[];
  initialRows: ScheduleRow[];
  initialFetchedAt: string;
  track: Track;
  error: string | null;
}

export default function ScheduleView({
  initialDays,
  initialRows,
  initialFetchedAt,
  track,
  error: initialError,
}: ScheduleViewProps) {
  const [scheduleDays, setScheduleDays] = useState<ParsedDay[]>(initialDays);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(initialRows);
  const [fetchError, setFetchError] = useState<string | null>(initialError);
  const [lastRefreshed, setLastRefreshed] = useState<string>(() => {
    const date = new Date(initialFetchedAt);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} IST`;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [csTime, setCsTime] = useState<string>("");

  const refreshIconRef = useRef<HTMLSpanElement>(null);

  const allDayLabels = scheduleDays.map((d) => d.dayLabel);

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const timeNow = new Date();
    setCsTime(
      `${pad(timeNow.getHours())}:${pad(timeNow.getMinutes())}:${pad(timeNow.getSeconds())} IST`,
    );
  }, [scheduleDays]);

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
      setScheduleRows(result.rows);
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

  const { currentSession, nextSession } = computeLiveBarState({
    rows: scheduleRows,
    allDayLabels,
    now,
  });

  let liveBarContent: React.ReactNode;
  let liveTimeText = "";
  let liveBarIsActive = false;

  if (currentSession) {
    const eventName =
      readColumn(
        currentSession.row,
        "Event",
        "event",
        "Session",
        "session",
        "Title",
        "title",
        "Activity",
      ) || "Current Session";
    const venueValue = readColumn(
      currentSession.row,
      "Venue",
      "venue",
      "Location",
      "location",
    );
    const speakerValue = readColumn(currentSession.row, "Speaker", "speaker");
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
    const eventName =
      readColumn(
        nextSession.row,
        "Event",
        "event",
        "Session",
        "session",
        "Title",
        "title",
        "Activity",
      ) || "Next Session";
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

      <section
        className="sec-schedule sched-page-body sched-blocks-body"
        id="schedule"
      >
        <div className="container">
          <div
            className="sched-page-meta-row"
            style={{ margin: 10, padding: 10 }}
          >
            <span className="spm-badge">LIVE SYNC</span>
            <span className="spm-text">
              Schedule syncs automatically from the master sheet · Last
              refreshed: <span>{lastRefreshed}</span>
            </span>
            <button
              className="refresh-btn"
              onClick={doRefresh}
              disabled={isRefreshing}
              title="Pull latest from Google Sheet"
            >
              <span ref={refreshIconRef}>↻</span>&nbsp;SYNC
            </button>
          </div>

          <div id="schedule-body">
            {fetchError ? (
              <div className="blocks-pending is-error">
                <div className="cs-icon">⚠</div>
                <div className="cs-title">CONNECTION ISSUE</div>
                <div className="cs-text">
                  Could not reach the archive. Check that the Google Sheet is
                  published to web as CSV.
                </div>
              </div>
            ) : scheduleDays.length === 0 ? (
              <div className="blocks-pending">
                <div className="cs-icon">∅</div>
                <div className="cs-title">SCHEDULE PENDING</div>
                <div className="cs-text">
                  The induction team is finalising the programme. This page
                  syncs automatically — check back soon.
                </div>
                <div className="cs-meta">
                  Last checked: <span id="cs-time">{csTime}</span>
                </div>
                <button className="cs-refresh" onClick={doRefresh}>
                  ↻ CHECK AGAIN
                </button>
              </div>
            ) : (
              <div className="day-blocks-grid">
                {scheduleDays.map((day) => (
                  <div className="day-block" key={day.dayLabel}>
                    <div className="day-block-hdr">
                      <span className="day-block-num">
                        DAY {String(day.dayIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="day-block-date">
                        {day.dayIndex === 0 ? "17 July 2026" : "18 July 2026"}
                      </span>
                    </div>
                    <div className="day-block-events">
                      {day.events.length === 0 ? (
                        <div className="dbe-empty">NO EVENTS LISTED YET</div>
                      ) : (
                        day.events.map((event, eventIndex) => (
                          <EventRow
                            key={eventIndex}
                            event={event}
                            allDayLabels={allDayLabels}
                            dayLabel={day.dayLabel}
                            now={now}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
