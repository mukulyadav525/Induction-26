"use client";

import { useEffect, useState } from "react";
import SspField from "@/components/SspField";

interface DbNotice {
  id: number;
  title: string;
  message: string;
  severity: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const BLANK_FORM = {
  title: "",
  message: "",
  severity: "info",
  is_active: true,
};

type FormState = typeof BLANK_FORM;

const SEVERITY_CHOICES = [
  {
    value: "info",
    label: "General update",
    hint: "Everyday information",
    color: "#2563eb",
  },
  {
    value: "warning",
    label: "Heads up",
    hint: "Something students should note, like a delay",
    color: "#d97706",
  },
  {
    value: "urgent",
    label: "Urgent",
    hint: "Important, time-sensitive, needs attention now",
    color: "#dc2626",
  },
];

function severityMeta(severity: string) {
  return (
    SEVERITY_CHOICES.find((s) => s.value === severity) ?? SEVERITY_CHOICES[0]
  );
}

export default function NoticesManager({ password }: { password: string }) {
  const [notices, setNotices] = useState<DbNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState("");

  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingNotice, setEditingNotice] = useState<DbNotice | null>(null);
  const [formState, setFormState] = useState<FormState>(BLANK_FORM);

  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [reorderBusyId, setReorderBusyId] = useState<number | null>(null);

  async function loadNotices() {
    setNoticesLoading(true);
    setNoticesError("");
    try {
      const res = await fetch(
        `/api/ssp/notices?password=${encodeURIComponent(password)}`,
      );
      const data = await res.json();
      if (data.error) setNoticesError(data.error);
      else setNotices(data.notices ?? []);
    } catch {
      setNoticesError("Could not load notices. Try refreshing the page.");
    } finally {
      setNoticesLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  function handleFormChange(field: keyof FormState, value: string | boolean) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function openAddForm() {
    setFormState(BLANK_FORM);
    setSaveError("");
    setActiveTab("add");
  }

  function openEditForm(notice: DbNotice) {
    setEditingNotice(notice);
    setFormState({
      title: notice.title,
      message: notice.message,
      severity: notice.severity,
      is_active: notice.is_active,
    });
    setSaveError("");
    setActiveTab("edit");
  }

  async function handleSaveNew() {
    setSaveBusy(true);
    setSaveError("");
    try {
      const nextSortOrder =
        notices.length === 0
          ? 0
          : Math.max(...notices.map((n) => n.sort_order)) + 1;

      const res = await fetch("/api/ssp/notices", {
        method: "POST",
        body: JSON.stringify({
          ...formState,
          sort_order: nextSortOrder,
          password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSaveError(data.error);
        return;
      }
      setSaveSuccess("Notice added — it's now live on the site.");
      setActiveTab("list");
      await loadNotices();
    } catch {
      setSaveError("Could not save this notice. Please try again.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingNotice) return;
    setSaveBusy(true);
    setSaveError("");
    try {
      const res = await fetch("/api/ssp/notices", {
        method: "PUT",
        body: JSON.stringify({ id: editingNotice.id, ...formState, password }),
      });
      const data = await res.json();
      if (data.error) {
        setSaveError(data.error);
        return;
      }
      setSaveSuccess("Changes saved.");
      setActiveTab("list");
      await loadNotices();
    } catch {
      setSaveError("Could not save this notice. Please try again.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDelete(id: number) {
    setSaveBusy(true);
    try {
      await fetch("/api/ssp/notices", {
        method: "DELETE",
        body: JSON.stringify({ id, password }),
      });
      setDeleteConfirmId(null);
      await loadNotices();
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleMove(notice: DbNotice, direction: "up" | "down") {
    const sortedNotices = [...notices].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const currentIndex = sortedNotices.findIndex((n) => n.id === notice.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sortedNotices.length) return;

    const neighbor = sortedNotices[swapIndex];
    setReorderBusyId(notice.id);
    try {
      await Promise.all([
        fetch("/api/ssp/notices", {
          method: "PUT",
          body: JSON.stringify({
            id: notice.id,
            sort_order: neighbor.sort_order,
            password,
          }),
        }),
        fetch("/api/ssp/notices", {
          method: "PUT",
          body: JSON.stringify({
            id: neighbor.id,
            sort_order: notice.sort_order,
            password,
          }),
        }),
      ]);
      await loadNotices();
    } finally {
      setReorderBusyId(null);
    }
  }

  if (activeTab === "add" || activeTab === "edit") {
    return (
      <div className="ssp-form-wrap">
        <button onClick={() => setActiveTab("list")} className="ssp-back-btn">
          ← Back to all notices
        </button>

        <div className="ssp-card">
          <h2 className="ssp-form-title">
            {activeTab === "add" ? "Write a new notice" : "Edit this notice"}
          </h2>
          <p className="notice-editor-subtitle">
            This will show up in the notices pop-up on the website as soon as
            you save it.
          </p>

          <div className="ssp-form-fields">
            <SspField
              label="Title"
              hint='A short heading, like "Fee deadline extended"'
            >
              <input
                value={formState.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="ssp-input notice-input-lg"
                placeholder="e.g. Venue Change for Day 1"
              />
            </SspField>

            <SspField
              label="Message"
              hint="Write it exactly as you want students to read it"
            >
              <textarea
                value={formState.message}
                onChange={(e) => handleFormChange("message", e.target.value)}
                className="ssp-input notice-textarea-lg"
                rows={5}
                placeholder="e.g. Day 1 orientation has moved from the Main Auditorium to LHC 101."
              />
            </SspField>

            <SspField
              label="How important is this?"
              hint="This changes the color so it stands out to students"
            >
              <div className="notice-severity-picker">
                {SEVERITY_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => handleFormChange("severity", choice.value)}
                    className={`notice-severity-choice ${formState.severity === choice.value ? "is-selected" : ""}`}
                    style={{ borderColor: choice.color }}
                  >
                    <span
                      className="notice-severity-choice-dot"
                      style={{ background: choice.color }}
                    />
                    <span className="notice-severity-choice-text">
                      <span className="notice-severity-choice-label">
                        {choice.label}
                      </span>
                      <span className="notice-severity-choice-hint">
                        {choice.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </SspField>

            <SspField label="Visibility">
              <button
                type="button"
                onClick={() =>
                  handleFormChange("is_active", !formState.is_active)
                }
                className={`notice-visibility-toggle ${formState.is_active ? "is-on" : "is-off"}`}
              >
                <span className="notice-visibility-toggle-track">
                  <span className="notice-visibility-toggle-knob" />
                </span>
                <span className="notice-visibility-toggle-label">
                  {formState.is_active
                    ? "Live — students can see this now"
                    : "Hidden — saved as a draft, not shown yet"}
                </span>
              </button>
            </SspField>
          </div>

          {saveError && (
            <div className="ssp-alert ssp-alert-error ssp-mt">{saveError}</div>
          )}

          <div className="ssp-form-actions">
            <button
              onClick={() => setActiveTab("list")}
              className="ssp-btn ssp-btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={activeTab === "add" ? handleSaveNew : handleSaveEdit}
              disabled={saveBusy || !formState.title || !formState.message}
              className={`ssp-btn ssp-btn-primary ${saveBusy || !formState.title || !formState.message ? "ssp-btn-disabled" : ""}`}
            >
              {saveBusy
                ? "Saving..."
                : activeTab === "add"
                  ? "Publish notice"
                  : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ssp-list-wrap">
      <div className="ssp-list-top">
        <div>
          <h1 className="ssp-list-heading">Notices</h1>
          <p className="ssp-list-count">
            {notices.length === 0
              ? "Nothing posted yet"
              : `${notices.length} notice${notices.length === 1 ? "" : "s"} · use the arrows to change the order they appear in`}
          </p>
        </div>
        <button onClick={openAddForm} className="ssp-btn ssp-btn-primary">
          + Write a notice
        </button>
      </div>

      {noticesError && (
        <div className="ssp-alert ssp-alert-error">{noticesError}</div>
      )}
      {saveSuccess && (
        <div className="ssp-alert ssp-alert-success">✓ {saveSuccess}</div>
      )}

      {notices.length === 0 && !noticesLoading ? (
        <div className="ssp-card ssp-empty">
          <div className="ssp-empty-icon">📢</div>
          <div className="ssp-empty-title">No notices yet</div>
          <div className="ssp-empty-sub">
            Write your first notice so students see it on the website.
          </div>
          <button
            onClick={openAddForm}
            className="ssp-btn ssp-btn-primary ssp-mt"
          >
            + Write your first notice
          </button>
        </div>
      ) : (
        <div className="ssp-notice-list">
          {[...notices]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((notice, index) => {
              const meta = severityMeta(notice.severity);
              return (
                <div key={notice.id} className="ssp-notice-row">
                  <div className="ssp-notice-move-col">
                    <button
                      onClick={() => handleMove(notice, "up")}
                      disabled={index === 0 || reorderBusyId !== null}
                      className="ssp-notice-move-btn"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMove(notice, "down")}
                      disabled={
                        index === notices.length - 1 || reorderBusyId !== null
                      }
                      className="ssp-notice-move-btn"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>

                  <span
                    className="ssp-notice-severity-dot"
                    style={{ background: meta.color }}
                  />

                  <div className="ssp-notice-body">
                    <div className="ssp-notice-title">{notice.title}</div>
                    <div className="ssp-notice-message">{notice.message}</div>
                  </div>

                  <div className="ssp-event-badges">
                    <span
                      className="ssp-badge"
                      style={{
                        background: `${meta.color}1a`,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                    {!notice.is_active && (
                      <span className="ssp-badge ssp-badge-hidden">Draft</span>
                    )}
                  </div>

                  <button
                    onClick={() => openEditForm(notice)}
                    className="ssp-notice-edit-btn"
                    aria-label="Edit notice"
                  >
                    ✏️
                  </button>

                  {deleteConfirmId === notice.id ? (
                    <div className="ssp-notice-confirm">
                      <button
                        onClick={() => handleDelete(notice.id)}
                        disabled={saveBusy}
                        className="ssp-btn ssp-btn-danger ssp-btn-sm"
                      >
                        Yes, delete it
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="ssp-btn ssp-btn-secondary ssp-btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(notice.id)}
                      className="ssp-btn ssp-btn-secondary ssp-btn-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
