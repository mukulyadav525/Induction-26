"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Track = "BTECH" | "PG" | "ALL";

interface DbEvent {
  id: number;
  track: Track;
  day_label: string;
  day_index: number;
  time: string;
  end_time: string;
  event: string;
  venue: string;
  speaker: string;
  status: string;
  type: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const BLANK_FORM = {
  track: "ALL" as Track,
  day_label: "",
  day_index: 0,
  time: "",
  end_time: "",
  event: "",
  venue: "",
  speaker: "",
  status: "",
  type: "",
  sort_order: 0,
};

type FormState = typeof BLANK_FORM;

const EVENT_TYPES = [
  "TALK",
  "KEYNOTE",
  "WORKSHOP",
  "CULTURAL",
  "ADMIN",
  "ORIENTATION",
  "SPORTS",
  "MEAL",
  "BREAK",
  "TOUR",
  "LECTURE",
  "CEREMONY",
];

const TYPE_LABELS: Record<string, string> = {
  TALK: "Talk",
  KEYNOTE: "Keynote",
  WORKSHOP: "Workshop",
  CULTURAL: "Cultural",
  ADMIN: "Admin",
  ORIENTATION: "Orientation",
  SPORTS: "Sports",
  MEAL: "Meal",
  BREAK: "Break",
  TOUR: "Tour",
  LECTURE: "Lecture",
  CEREMONY: "Ceremony",
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  TALK: { bg: "#e8f5e9", color: "#2e7d32" },
  KEYNOTE: { bg: "#e8f5e9", color: "#2e7d32" },
  WORKSHOP: { bg: "#fff3e0", color: "#e65100" },
  CULTURAL: { bg: "#f3e5f5", color: "#6a1b9a" },
  ADMIN: { bg: "#e3f2fd", color: "#1565c0" },
  ORIENTATION: { bg: "#e3f2fd", color: "#1565c0" },
  SPORTS: { bg: "#e0f7fa", color: "#00695c" },
  MEAL: { bg: "#fce4ec", color: "#880e4f" },
  BREAK: { bg: "#f5f5f5", color: "#616161" },
  TOUR: { bg: "#e0f2f1", color: "#004d40" },
  LECTURE: { bg: "#e8f5e9", color: "#2e7d32" },
  CEREMONY: { bg: "#ede7f6", color: "#4527a0" },
};

const DAY_OPTIONS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

function dayLabelToIndex(label: string): number {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) - 1 : 0;
}

function parseClockTimeToMinutes(timeText: string): number | null {
  const match = timeText.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  const [, hourText, minuteText, meridiem] = match;
  let hour = parseInt(hourText, 10);
  const minute = parseInt(minuteText, 10);
  if (meridiem) {
    const isPM = meridiem.toUpperCase() === "PM";
    if (hour === 12) hour = 0;
    if (isPM) hour += 12;
  }
  return hour * 60 + minute;
}

function formatMinutesToClockTime(totalMinutes: number): string {
  const wrappedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(wrappedMinutes / 60);
  const minute = wrappedMinutes % 60;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

function shiftClockTime(timeText: string, minutesToAdd: number): string {
  const parsedMinutes = parseClockTimeToMinutes(timeText);
  if (parsedMinutes === null) return timeText;
  return formatMinutesToClockTime(parsedMinutes + minutesToAdd);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ssp-field">
      <label className="ssp-field-label">{label}</label>
      {hint && <span className="ssp-field-hint">{hint}</span>}
      {children}
    </div>
  );
}

export default function SupersecretPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [events, setEvents] = useState<DbEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingEvent, setEditingEvent] = useState<DbEvent | null>(null);
  const [formState, setFormState] = useState<FormState>(BLANK_FORM);
  const [filterTrack, setFilterTrack] = useState<"ALL" | "BTECH" | "PG">("ALL");
  const [filterDay, setFilterDay] = useState("ALL");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [delayDay, setDelayDay] = useState("");
  const [delayTrack, setDelayTrack] = useState<"ALL" | "BTECH" | "PG">("ALL");
  const [delayAfterEventId, setDelayAfterEventId] = useState<number | "">("");
  const [delayMinutesText, setDelayMinutesText] = useState("30");
  const [delayBusy, setDelayBusy] = useState(false);
  const [delayError, setDelayError] = useState("");
  const [delaySuccess, setDelaySuccess] = useState("");

  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError("");
    try {
      const res = await fetch("/api/ssp/events");
      const data = await res.json();
      if (data.events) setEvents(data.events);
      else setEventsError(data.error ?? "Failed to load events.");
    } catch {
      setEventsError("Network error. Check your connection.");
    } finally {
      setEventsLoading(false);
    }
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/ssp/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuthenticated(true);
        loadEvents();
      } else {
        setAuthError("Wrong password. Try again.");
        setPassword("");
        passwordInputRef.current?.focus();
      }
    } catch {
      setAuthError("Network error. Check your connection.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    if (name === "day_label") {
      setFormState((prev) => ({
        ...prev,
        day_label: value,
        day_index: dayLabelToIndex(value),
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  }

  function openAddForm() {
    setFormState(BLANK_FORM);
    setEditingEvent(null);
    setSaveError("");
    setSaveSuccess("");
    setActiveTab("add");
  }

  function openEditForm(ev: DbEvent) {
    setEditingEvent(ev);
    setFormState({
      track: ev.track,
      day_label: ev.day_label,
      day_index: ev.day_index,
      time: ev.time,
      end_time: ev.end_time,
      event: ev.event,
      venue: ev.venue,
      speaker: ev.speaker,
      status: ev.status ?? "",
      type: ev.type ?? "",
      sort_order: ev.sort_order,
    });
    setSaveError("");
    setSaveSuccess("");
    setActiveTab("edit");
  }

  async function handleSaveNew() {
    setSaveBusy(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      const res = await fetch("/api/ssp/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, password }),
      });
      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) => [...prev, data.event]);
        setSaveSuccess("Event added successfully!");
        setFormState(BLANK_FORM);
        setActiveTab("list");
      } else {
        setSaveError(
          data.error ?? "Couldn't save. Check your password and try again.",
        );
      }
    } catch {
      setSaveError("Network error. Check your connection.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingEvent) return;
    setSaveBusy(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      const res = await fetch("/api/ssp/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, id: editingEvent.id, password }),
      });
      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === data.event.id ? data.event : ev)),
        );
        setSaveSuccess("Event updated!");
        setActiveTab("list");
      } else {
        setSaveError(
          data.error ?? "Couldn't save. Check your password and try again.",
        );
      }
    } catch {
      setSaveError("Network error. Check your connection.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDelete(id: number) {
    setSaveBusy(true);
    setSaveError("");
    try {
      const res = await fetch("/api/ssp/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        setDeleteConfirmId(null);
        if (editingEvent?.id === id) setActiveTab("list");
      } else {
        setSaveError(
          data.error ?? "Couldn't delete. Check your password and try again.",
        );
      }
    } catch {
      setSaveError("Network error. Check your connection.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function updateEventTime(
    id: number,
    time: string,
    end_time: string,
  ): Promise<DbEvent | null> {
    const res = await fetch("/api/ssp/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, time, end_time, password }),
    });
    const data = await res.json();
    return res.ok && data.event ? data.event : null;
  }

  async function applyDelay() {
    setDelayBusy(true);
    setDelayError("");
    setDelaySuccess("");
    const delayMinutes = resolvedDelayMinutes;
    try {
      const anchorEvent = delayAfterEventId
        ? events.find((ev) => ev.id === delayAfterEventId)
        : null;
      const anchorMinutes = anchorEvent
        ? parseClockTimeToMinutes(anchorEvent.time)
        : null;

      const resolvedDelayDay =
        delayDay || (filterDay !== "ALL" ? filterDay : (allDays[0] ?? ""));
      const eventsOnDay = events.filter(
        (ev) => ev.day_label === resolvedDelayDay,
      );
      const eventsToDelay = eventsOnDay.filter((ev) => {
        const trackMatch = delayTrack === "ALL" || ev.track === delayTrack;
        if (!trackMatch) return false;
        if (anchorMinutes === null) return true;
        const eventMinutes = parseClockTimeToMinutes(ev.time);
        return eventMinutes !== null && eventMinutes > anchorMinutes;
      });

      if (eventsToDelay.length === 0) {
        setDelayError("No events matched. Check the day and reference event.");
        return;
      }

      const updatedEvents: DbEvent[] = [];
      for (const ev of eventsToDelay) {
        const newTime = shiftClockTime(ev.time, delayMinutes);
        const newEndTime = ev.end_time
          ? shiftClockTime(ev.end_time, delayMinutes)
          : ev.end_time;
        const updated = await updateEventTime(ev.id, newTime, newEndTime);
        if (updated) updatedEvents.push(updated);
      }

      setEvents((prev) =>
        prev.map(
          (ev) => updatedEvents.find((updated) => updated.id === ev.id) ?? ev,
        ),
      );
      setDelaySuccess(
        `Shifted ${updatedEvents.length} event${updatedEvents.length === 1 ? "" : "s"} by ${delayMinutes} minutes.`,
      );
    } catch {
      setDelayError("Network error while shifting events.");
    } finally {
      setDelayBusy(false);
    }
  }

  const allDays = Array.from(new Set(events.map((ev) => ev.day_label))).sort();

  const filteredEvents = events.filter((ev) => {
    const trackMatch =
      filterTrack === "ALL" || ev.track === filterTrack || ev.track === "ALL";
    const dayMatch = filterDay === "ALL" || ev.day_label === filterDay;
    const searchMatch =
      !searchQuery ||
      [ev.event, ev.venue, ev.speaker, ev.day_label, ev.type]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return trackMatch && dayMatch && searchMatch;
  });

  const activeDelayDay =
    delayDay || (filterDay !== "ALL" ? filterDay : (allDays[0] ?? ""));
  const resolvedDelayMinutes = parseInt(delayMinutesText, 10) || 0;
  const eventsOnSelectedDelayDay = events.filter(
    (ev) =>
      ev.day_label === activeDelayDay &&
      (delayTrack === "ALL" || ev.track === delayTrack),
  );

  const isFormDisabled = saveBusy || !formState.event || !formState.day_label;

  if (!authenticated) {
    return (
      <>
        <div className="ssp-login-bg">
          <div className="ssp-login-card">
            <div className="ssp-login-header">
              <div className="ssp-login-title">Schedule Manager</div>
              <div className="ssp-login-sub">IIIT Delhi · Induction 2026</div>
            </div>
            <form onSubmit={handleAuth} className="ssp-login-form">
              <Field label="Password">
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="ssp-input"
                />
              </Field>
              {authError && (
                <div className="ssp-alert ssp-alert-error">{authError}</div>
              )}
              <button
                type="submit"
                disabled={authLoading || !password}
                className={`ssp-btn ssp-btn-primary ssp-btn-full ${authLoading || !password ? "ssp-btn-disabled" : ""}`}
              >
                {authLoading ? "Checking..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const formPanel = (
    <div className="ssp-form-wrap">
      <button onClick={() => setActiveTab("list")} className="ssp-back-btn">
        ← Back to all events
      </button>

      <div className="ssp-card">
        <h2 className="ssp-form-title">
          {activeTab === "add" ? "Add New Event" : "Edit Event"}
        </h2>

        <div className="ssp-form-fields">
          <Field label="Event Name *" hint="What is this event called?">
            <input
              name="event"
              value={formState.event}
              onChange={handleFormChange}
              placeholder="e.g. Welcome Address by Director"
              className="ssp-input"
            />
          </Field>

          <div className="ssp-grid-2">
            <Field label="Day" hint="Which day does this happen?">
              <select
                name="day_label"
                value={formState.day_label}
                onChange={handleFormChange}
                className="ssp-select"
              >
                <option value="">Select day</option>
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Who sees this?" hint="Which batch of students?">
              <select
                name="track"
                value={formState.track}
                onChange={handleFormChange}
                className="ssp-select"
              >
                <option value="ALL">Everyone (B.Tech + PG)</option>
                <option value="BTECH">B.Tech only</option>
                <option value="PG">PG only</option>
              </select>
            </Field>

            <Field label="Start Time" hint="e.g. 9:30 AM">
              <input
                name="time"
                value={formState.time}
                onChange={handleFormChange}
                placeholder="9:30 AM"
                className="ssp-input"
              />
            </Field>

            <Field label="End Time" hint="e.g. 10:30 AM">
              <input
                name="end_time"
                value={formState.end_time}
                onChange={handleFormChange}
                placeholder="10:30 AM"
                className="ssp-input"
              />
            </Field>
          </div>

          <div className="ssp-grid-2">
            <Field label="Venue" hint="Leave blank if not decided yet">
              <input
                name="venue"
                value={formState.venue}
                onChange={handleFormChange}
                placeholder="e.g. Lecture Hall 1"
                className="ssp-input"
              />
            </Field>

            <Field
              label="Speaker / Host"
              hint="Who is running this? Leave blank if none"
            >
              <input
                name="speaker"
                value={formState.speaker}
                onChange={handleFormChange}
                placeholder="e.g. Dr. Pankaj Jalote"
                className="ssp-input"
              />
            </Field>

            <Field label="Event Type" hint="What kind of event is this?">
              <select
                name="type"
                value={formState.type}
                onChange={handleFormChange}
                className="ssp-select"
              >
                <option value="">Not specified</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Status"
              hint="Is this event confirmed or still being planned?"
            >
              <select
                name="status"
                value={formState.status}
                onChange={handleFormChange}
                className="ssp-select"
              >
                <option value="">Not set</option>
                <option value="CONFIRMED">Confirmed ✓</option>
                <option value="OPEN">Still being planned</option>
              </select>
            </Field>
          </div>

          <Field
            label="Display order within the day"
            hint="Events are sorted by time automatically. Only change this if two events start at the same time and you want to control which appears first. Lower number = appears first."
          >
            <input
              name="sort_order"
              type="number"
              value={formState.sort_order}
              onChange={handleFormChange}
              placeholder="0"
              min={0}
              className="ssp-input ssp-input-sm"
            />
          </Field>
        </div>

        {saveError && (
          <div className="ssp-alert ssp-alert-error ssp-mt">{saveError}</div>
        )}

        <div className="ssp-form-actions">
          <div className="ssp-form-actions-left">
            <button
              onClick={activeTab === "add" ? handleSaveNew : handleSaveEdit}
              disabled={isFormDisabled}
              className={`ssp-btn ssp-btn-primary ${isFormDisabled ? "ssp-btn-disabled" : ""}`}
            >
              {saveBusy
                ? "Saving..."
                : activeTab === "add"
                  ? "Add Event"
                  : "Save Changes"}
            </button>

            <button
              onClick={() => setActiveTab("list")}
              className="ssp-btn ssp-btn-secondary"
            >
              Cancel
            </button>
          </div>

          {activeTab === "edit" && editingEvent && (
            <div className="ssp-form-actions-right">
              {deleteConfirmId === editingEvent.id ? (
                <div className="ssp-delete-confirm">
                  <span className="ssp-delete-confirm-text">
                    Delete this event permanently?
                  </span>
                  <button
                    onClick={() => handleDelete(editingEvent.id)}
                    disabled={saveBusy}
                    className="ssp-btn ssp-btn-danger"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="ssp-btn ssp-btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(editingEvent.id)}
                  className="ssp-btn ssp-btn-danger-outline"
                >
                  Delete event
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="ssp-root">
        <header className="ssp-header">
          <div className="ssp-header-brand">
            <span className="ssp-header-title">Schedule Manager</span>
            <span className="ssp-header-sub">IIIT Delhi · Induction 2026</span>
          </div>
          <div className="ssp-header-actions">
            {eventsLoading && (
              <span className="ssp-loading-text">Loading...</span>
            )}
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword("");
                setEvents([]);
                setActiveTab("list");
              }}
              className="ssp-btn ssp-btn-secondary"
            >
              Sign out
            </button>
          </div>
        </header>

        {activeTab === "list" && (
          <div className="ssp-list-wrap">
            <div className="ssp-list-top">
              <div>
                <h1 className="ssp-list-heading">All Events</h1>
                <p className="ssp-list-count">
                  {filteredEvents.length} of {events.length} events shown
                </p>
              </div>
              <button onClick={openAddForm} className="ssp-btn ssp-btn-primary">
                + Add Event
              </button>
            </div>

            <div className="ssp-filters-bar">
              <div className="ssp-filter-group">
                {(["ALL", "BTECH", "PG"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTrack(t)}
                    className={`ssp-pill ${filterTrack === t ? "ssp-pill-active" : ""}`}
                  >
                    {t === "ALL"
                      ? "All students"
                      : t === "BTECH"
                        ? "B.Tech"
                        : "PG"}
                  </button>
                ))}
              </div>

              <div className="ssp-filter-group ssp-filter-days">
                <button
                  onClick={() => setFilterDay("ALL")}
                  className={`ssp-pill ssp-pill-day ${filterDay === "ALL" ? "ssp-pill-day-active" : ""}`}
                >
                  All days
                </button>
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setFilterDay(day)}
                    className={`ssp-pill ssp-pill-day ${filterDay === day ? "ssp-pill-day-active" : ""}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <input
                placeholder="Search events, venues, speakers…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ssp-input ssp-search-input"
              />
            </div>

            {allDays.length > 0 && (
              <div className="ssp-card">
                <h2 className="ssp-form-title">Delay a day&apos;s schedule</h2>
                <div className="ssp-form-fields">
                  <div className="ssp-grid-2">
                    <Field label="Day" hint="Which day are we delaying?">
                      <select
                        value={activeDelayDay}
                        onChange={(e) => {
                          setDelayDay(e.target.value);
                          setDelayAfterEventId("");
                        }}
                        className="ssp-select"
                      >
                        {allDays.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label="Delay by (minutes)"
                      hint="30 = half hour later, 60 = hour later, -30 = half hour earlier"
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        value={delayMinutesText}
                        onChange={(e) => setDelayMinutesText(e.target.value)}
                        className="ssp-input"
                      />
                    </Field>
                  </div>

                  <div className="ssp-grid-2">
                    <Field
                      label="Who does this apply to?"
                      hint="Shared events only shift under 'All tracks'"
                    >
                      <select
                        value={delayTrack}
                        onChange={(e) => {
                          setDelayTrack(
                            e.target.value as "ALL" | "BTECH" | "PG",
                          );
                          setDelayAfterEventId("");
                        }}
                        className="ssp-select"
                      >
                        <option value="ALL">All tracks</option>
                        <option value="BTECH">B.Tech only</option>
                        <option value="PG">PG only</option>
                      </select>
                    </Field>

                    <Field
                      label="Only shift events after"
                      hint="Leave as 'Whole day' to shift every matching event"
                    >
                      <select
                        value={delayAfterEventId}
                        onChange={(e) =>
                          setDelayAfterEventId(
                            e.target.value ? Number(e.target.value) : "",
                          )
                        }
                        className="ssp-select"
                      >
                        <option value="">Whole day</option>
                        {eventsOnSelectedDelayDay.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.time || "—"} · {ev.event}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                {delayError && (
                  <div className="ssp-alert ssp-alert-error">{delayError}</div>
                )}
                {delaySuccess && (
                  <div className="ssp-alert ssp-alert-success">
                    ✓ {delaySuccess}
                  </div>
                )}

                <button
                  onClick={applyDelay}
                  disabled={
                    delayBusy || !activeDelayDay || !resolvedDelayMinutes
                  }
                  className={`ssp-btn ssp-btn-primary ssp-mt ${delayBusy || !activeDelayDay || !resolvedDelayMinutes ? "ssp-btn-disabled" : ""}`}
                >
                  {delayBusy ? "Shifting..." : "Apply delay"}
                </button>
              </div>
            )}

            {eventsError && (
              <div className="ssp-alert ssp-alert-error">{eventsError}</div>
            )}
            {saveSuccess && (
              <div className="ssp-alert ssp-alert-success">✓ {saveSuccess}</div>
            )}

            {filteredEvents.length === 0 ? (
              <div className="ssp-card ssp-empty">
                <div className="ssp-empty-icon">📅</div>
                <div className="ssp-empty-title">
                  {events.length === 0
                    ? "No events yet"
                    : "No events match your filters"}
                </div>
                <div className="ssp-empty-sub">
                  {events.length === 0
                    ? "Add your first event to get started."
                    : "Try changing the day or student filter."}
                </div>
                {events.length === 0 && (
                  <button
                    onClick={openAddForm}
                    className="ssp-btn ssp-btn-primary ssp-mt"
                  >
                    + Add first event
                  </button>
                )}
              </div>
            ) : (
              <div className="ssp-event-list">
                {filteredEvents.map((ev) => {
                  const typeStyle = ev.type
                    ? (TYPE_COLORS[ev.type] ?? {
                        bg: "#f3f4f6",
                        color: "#374151",
                      })
                    : null;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => openEditForm(ev)}
                      className="ssp-event-row"
                    >
                      <div className="ssp-event-time">
                        <div className="ssp-event-day">{ev.day_label}</div>
                        <div className="ssp-event-clock">{ev.time || "—"}</div>
                      </div>

                      <div className="ssp-event-divider" />

                      <div className="ssp-event-body">
                        <div className="ssp-event-name">{ev.event}</div>
                        <div className="ssp-event-meta">
                          {[ev.venue, ev.speaker].filter(Boolean).join(" · ") ||
                            "No venue or speaker set"}
                        </div>
                      </div>

                      <div className="ssp-event-badges">
                        <span
                          className={`ssp-badge ssp-badge-track ssp-badge-track-${ev.track.toLowerCase()}`}
                        >
                          {ev.track === "ALL" ? "Everyone" : ev.track}
                        </span>
                        {typeStyle && ev.type && (
                          <span
                            className="ssp-badge"
                            style={{
                              background: typeStyle.bg,
                              color: typeStyle.color,
                            }}
                          >
                            {TYPE_LABELS[ev.type] ?? ev.type}
                          </span>
                        )}
                        {ev.status && (
                          <span
                            className={`ssp-badge ssp-badge-status-${ev.status.toLowerCase()}`}
                          >
                            {ev.status === "CONFIRMED"
                              ? "✓ Confirmed"
                              : "⏳ Planning"}
                          </span>
                        )}
                      </div>

                      <div className="ssp-event-arrow">›</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {(activeTab === "add" || activeTab === "edit") && formPanel}
      </div>
    </>
  );
}
