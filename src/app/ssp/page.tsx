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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      {hint && (
        <span style={{ fontSize: 12, color: "#9ca3af", marginTop: -4 }}>
          {hint}
        </span>
      )}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#111827",
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "system-ui, sans-serif",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto",
};

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

  if (!authenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 380,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: 40,
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Schedule Manager
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              IIIT Delhi · Induction 2026
            </div>
          </div>
          <form
            onSubmit={handleAuth}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Field label="Password">
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                style={inputStyle}
              />
            </Field>
            {authError && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#dc2626",
                }}
              >
                {authError}
              </div>
            )}
            <button
              type="submit"
              disabled={authLoading || !password}
              style={{
                background: authLoading || !password ? "#e5e7eb" : "#111827",
                color: authLoading || !password ? "#9ca3af" : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                cursor: authLoading || !password ? "default" : "pointer",
                fontFamily: "system-ui, sans-serif",
                marginTop: 4,
              }}
            >
              {authLoading ? "Checking..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const formPanel = (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <button
          onClick={() => setActiveTab("list")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: 14,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to all events
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: 28,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 24px 0",
          }}
        >
          {activeTab === "add" ? "Add New Event" : `Edit Event`}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field label="Event Name *" hint="What is this event called?">
            <input
              name="event"
              value={formState.event}
              onChange={handleFormChange}
              placeholder="e.g. Welcome Address by Director"
              style={inputStyle}
            />
          </Field>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field label="Day" hint="Which day does this happen?">
              <select
                name="day_label"
                value={formState.day_label}
                onChange={handleFormChange}
                style={selectStyle}
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
                style={selectStyle}
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
                style={inputStyle}
              />
            </Field>

            <Field label="End Time" hint="e.g. 10:30 AM">
              <input
                name="end_time"
                value={formState.end_time}
                onChange={handleFormChange}
                placeholder="10:30 AM"
                style={inputStyle}
              />
            </Field>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Field label="Venue" hint="Leave blank if not decided yet">
              <input
                name="venue"
                value={formState.venue}
                onChange={handleFormChange}
                placeholder="e.g. Lecture Hall 1"
                style={inputStyle}
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
                style={inputStyle}
              />
            </Field>

            <Field label="Event Type" hint="What kind of event is this?">
              <select
                name="type"
                value={formState.type}
                onChange={handleFormChange}
                style={selectStyle}
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
                style={selectStyle}
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
              style={{ ...inputStyle, width: 100 }}
            />
          </Field>
        </div>

        {saveError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "12px 16px",
              fontSize: 13,
              color: "#dc2626",
              marginTop: 20,
            }}
          >
            {saveError}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={activeTab === "add" ? handleSaveNew : handleSaveEdit}
            disabled={saveBusy || !formState.event || !formState.day_label}
            style={{
              background:
                saveBusy || !formState.event || !formState.day_label
                  ? "#e5e7eb"
                  : "#111827",
              color:
                saveBusy || !formState.event || !formState.day_label
                  ? "#9ca3af"
                  : "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor:
                saveBusy || !formState.event || !formState.day_label
                  ? "default"
                  : "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {saveBusy
              ? "Saving..."
              : activeTab === "add"
                ? "Add Event"
                : "Save Changes"}
          </button>

          <button
            onClick={() => setActiveTab("list")}
            style={{
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "11px 20px",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Cancel
          </button>

          {activeTab === "edit" && editingEvent && (
            <div style={{ marginLeft: "auto" }}>
              {deleteConfirmId === editingEvent.id ? (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 8,
                    padding: "8px 14px",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}
                  >
                    Delete this event permanently?
                  </span>
                  <button
                    onClick={() => handleDelete(editingEvent.id)}
                    disabled={saveBusy}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    style={{
                      background: "none",
                      color: "#6b7280",
                      border: "none",
                      fontSize: 13,
                      cursor: "pointer",
                      padding: "6px 8px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(editingEvent.id)}
                  style={{
                    background: "#fff",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: 8,
                    padding: "11px 18px",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                  }}
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            Schedule Manager
          </span>
          <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 12 }}>
            IIIT Delhi · Induction 2026
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {eventsLoading && (
            <span style={{ fontSize: 13, color: "#9ca3af" }}>Loading...</span>
          )}
          <button
            onClick={() => {
              setAuthenticated(false);
              setPassword("");
              setEvents([]);
              setActiveTab("list");
            }}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                All Events
              </h1>
              <p
                style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0 0" }}
              >
                {filteredEvents.length} of {events.length} events shown
              </p>
            </div>
            <button
              onClick={openAddForm}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Event
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              marginBottom: 16,
              padding: "16px 20px",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {(["ALL", "BTECH", "PG"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTrack(t)}
                  style={{
                    background: filterTrack === t ? "#111827" : "#f3f4f6",
                    color: filterTrack === t ? "#fff" : "#374151",
                    border: "none",
                    borderRadius: 6,
                    padding: "7px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {t === "ALL"
                    ? "All students"
                    : t === "BTECH"
                      ? "B.Tech"
                      : "PG"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterDay("ALL")}
                style={{
                  background: filterDay === "ALL" ? "#f0fdf4" : "#f3f4f6",
                  color: filterDay === "ALL" ? "#15803d" : "#374151",
                  border:
                    filterDay === "ALL"
                      ? "1px solid #bbf7d0"
                      : "1px solid transparent",
                  borderRadius: 6,
                  padding: "7px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                All days
              </button>
              {allDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setFilterDay(day)}
                  style={{
                    background: filterDay === day ? "#f0fdf4" : "#f3f4f6",
                    color: filterDay === day ? "#15803d" : "#374151",
                    border:
                      filterDay === day
                        ? "1px solid #bbf7d0"
                        : "1px solid transparent",
                    borderRadius: 6,
                    padding: "7px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <input
              placeholder="Search by name, venue, speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, width: 240, marginLeft: "auto" }}
            />
          </div>

          {eventsError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 13,
                color: "#dc2626",
                marginBottom: 16,
              }}
            >
              {eventsError}
            </div>
          )}
          {saveSuccess && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 13,
                color: "#15803d",
                marginBottom: 16,
              }}
            >
              ✓ {saveSuccess}
            </div>
          )}

          {filteredEvents.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                {events.length === 0
                  ? "No events yet"
                  : "No events match your filters"}
              </div>
              <div style={{ fontSize: 14, color: "#9ca3af" }}>
                {events.length === 0
                  ? "Add your first event to get started."
                  : "Try changing the day or student filter."}
              </div>
              {events.length === 0 && (
                <button
                  onClick={openAddForm}
                  style={{
                    marginTop: 20,
                    background: "#111827",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Add first event
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      cursor: "pointer",
                      transition: "box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <div style={{ minWidth: 70, textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#6b7280",
                        }}
                      >
                        {ev.day_label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#111827",
                          fontWeight: 500,
                          marginTop: 2,
                        }}
                      >
                        {ev.time || "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        width: 1,
                        height: 36,
                        background: "#e5e7eb",
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.event}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}
                      >
                        {[ev.venue, ev.speaker].filter(Boolean).join(" · ") ||
                          "No venue or speaker set"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            ev.track === "BTECH"
                              ? "#1565c0"
                              : ev.track === "PG"
                                ? "#6a1b9a"
                                : "#374151",
                          background:
                            ev.track === "BTECH"
                              ? "#e3f2fd"
                              : ev.track === "PG"
                                ? "#f3e5f5"
                                : "#f3f4f6",
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        {ev.track === "ALL" ? "Everyone" : ev.track}
                      </span>

                      {typeStyle && ev.type && (
                        <span
                          style={{
                            fontSize: 11,
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontWeight: 500,
                          }}
                        >
                          {TYPE_LABELS[ev.type] ?? ev.type}
                        </span>
                      )}

                      {ev.status && (
                        <span
                          style={{
                            fontSize: 11,
                            color:
                              ev.status === "CONFIRMED" ? "#15803d" : "#d97706",
                            fontWeight: 500,
                          }}
                        >
                          {ev.status === "CONFIRMED"
                            ? "✓ Confirmed"
                            : "⏳ Planning"}
                        </span>
                      )}
                    </div>

                    <div
                      style={{ color: "#9ca3af", fontSize: 16, flexShrink: 0 }}
                    >
                      ›
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {(activeTab === "add" || activeTab === "edit") && formPanel}
    </div>
  );
}
