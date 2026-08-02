"use client";

import { useEffect, useState } from "react";
import SspField from "@/components/SspField";
import { DbArtistReveal } from "@/lib/artistsDb";
import {
  ARTIST_REVEAL_VARIANTS,
  DEFAULT_ARTIST_REVEAL_VARIANT,
} from "@/lib/revealVariants";

const BLANK_FORM = {
  name: "",
  role: "",
  photoUrl: "",
  badge: "",
  revealVariant: DEFAULT_ARTIST_REVEAL_VARIANT,
};

type FormState = typeof BLANK_FORM;

export default function ArtistsManager({ password }: { password: string }) {
  const [artists, setArtists] = useState<DbArtistReveal[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [artistsError, setArtistsError] = useState("");

  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingArtist, setEditingArtist] = useState<DbArtistReveal | null>(
    null,
  );
  const [formState, setFormState] = useState<FormState>(BLANK_FORM);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [reorderBusyId, setReorderBusyId] = useState<number | null>(null);

  async function loadArtists() {
    setArtistsLoading(true);
    setArtistsError("");
    try {
      const res = await fetch(
        `/api/ssp/artists?password=${encodeURIComponent(password)}`,
      );
      const data = await res.json();
      if (data.error) setArtistsError(data.error);
      else setArtists(data.artists ?? []);
    } catch {
      setArtistsError("Could not load artists. Try refreshing the page.");
    } finally {
      setArtistsLoading(false);
    }
  }

  useEffect(() => {
    loadArtists();
  }, []);

  function handleFormChange(field: keyof FormState, value: string) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleRevealVariantChange(value: (typeof BLANK_FORM)["revealVariant"]) {
    setFormState((prev) => ({ ...prev, revealVariant: value }));
  }

  function openAddForm() {
    setFormState(BLANK_FORM);
    setSelectedPhotoFile(null);
    setSaveError("");
    setActiveTab("add");
  }

  function openEditForm(artist: DbArtistReveal) {
    setEditingArtist(artist);
    setFormState({
      name: artist.name,
      role: artist.role,
      photoUrl: artist.photoUrl,
      badge: artist.badge,
      revealVariant: artist.revealVariant ?? DEFAULT_ARTIST_REVEAL_VARIANT,
    });
    setSelectedPhotoFile(null);
    setSaveError("");
    setActiveTab("edit");
  }

  async function uploadArtistPhoto(artistId: number, file: File): Promise<string | null> {
    const uploadFormData = new FormData();
    uploadFormData.append("password", password);
    uploadFormData.append("id", String(artistId));
    uploadFormData.append("file", file);

    const res = await fetch("/api/ssp/artists/upload", {
      method: "POST",
      body: uploadFormData,
    });
    const data = await res.json();
    if (data.error) {
      setSaveError(data.error);
      return null;
    }
    return data.photoUrl as string;
  }

  async function handleSaveNew() {
    setSaveBusy(true);
    setSaveError("");
    try {
      const nextSortOrder =
        artists.length === 0
          ? 0
          : Math.max(...artists.map((a) => a.sortOrder)) + 1;

      const res = await fetch("/api/ssp/artists", {
        method: "POST",
        body: JSON.stringify({
          ...formState,
          sortOrder: nextSortOrder,
          password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSaveError(data.error);
        return;
      }

      if (selectedPhotoFile) {
        const uploadedPhotoUrl = await uploadArtistPhoto(
          data.artist.id,
          selectedPhotoFile,
        );
        if (!uploadedPhotoUrl) return;
        await fetch("/api/ssp/artists", {
          method: "PUT",
          body: JSON.stringify({
            id: data.artist.id,
            photoUrl: uploadedPhotoUrl,
            password,
          }),
        });
      }

      setSaveSuccess("Artist added — it's now in the reveal lineup.");
      setSelectedPhotoFile(null);
      setActiveTab("list");
      await loadArtists();
    } catch {
      setSaveError("Could not save this artist. Please try again.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingArtist) return;
    setSaveBusy(true);
    setSaveError("");
    try {
      let photoUrlToSave = formState.photoUrl;
      if (selectedPhotoFile) {
        const uploadedPhotoUrl = await uploadArtistPhoto(
          editingArtist.id,
          selectedPhotoFile,
        );
        if (!uploadedPhotoUrl) return;
        photoUrlToSave = uploadedPhotoUrl;
      }

      const res = await fetch("/api/ssp/artists", {
        method: "PUT",
        body: JSON.stringify({
          id: editingArtist.id,
          ...formState,
          photoUrl: photoUrlToSave,
          password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSaveError(data.error);
        return;
      }
      setSaveSuccess("Changes saved.");
      setSelectedPhotoFile(null);
      setActiveTab("list");
      await loadArtists();
    } catch {
      setSaveError("Could not save this artist. Please try again.");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDelete(id: number) {
    setSaveBusy(true);
    try {
      await fetch("/api/ssp/artists", {
        method: "DELETE",
        body: JSON.stringify({ id, password }),
      });
      setDeleteConfirmId(null);
      await loadArtists();
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleMove(artist: DbArtistReveal, direction: "up" | "down") {
    const sortedArtists = [...artists].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    const currentIndex = sortedArtists.findIndex((a) => a.id === artist.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sortedArtists.length) return;

    const neighbor = sortedArtists[swapIndex];
    setReorderBusyId(artist.id);
    try {
      await Promise.all([
        fetch("/api/ssp/artists", {
          method: "PUT",
          body: JSON.stringify({
            id: artist.id,
            sortOrder: neighbor.sortOrder,
            password,
          }),
        }),
        fetch("/api/ssp/artists", {
          method: "PUT",
          body: JSON.stringify({
            id: neighbor.id,
            sortOrder: artist.sortOrder,
            password,
          }),
        }),
      ]);
      await loadArtists();
    } finally {
      setReorderBusyId(null);
    }
  }

  if (activeTab === "add" || activeTab === "edit") {
    return (
      <div className="ssp-form-wrap">
        <button onClick={() => setActiveTab("list")} className="ssp-back-btn">
          ← Back to all artists
        </button>

        <div className="ssp-card">
          <h2 className="ssp-form-title">
            {activeTab === "add" ? "Add an artist" : "Edit this artist"}
          </h2>
          <p className="notice-editor-subtitle">
            The reveal dialog in the hero section shows the 4 most recent
            artists.
          </p>

          <div className="ssp-form-fields">
            <SspField label="Name" hint="Artist or act name">
              <input
                value={formState.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="ssp-input notice-input-lg"
                placeholder="e.g. DJ Nucleya"
              />
            </SspField>

            <SspField label="Role" hint="What they perform">
              <input
                value={formState.role}
                onChange={(e) => handleFormChange("role", e.target.value)}
                className="ssp-input notice-input-lg"
                placeholder="e.g. DJ Night Headliner"
              />
            </SspField>

            <SspField
              label="Photo URL"
              hint="Link to the artist photo, or upload one below"
            >
              <input
                value={formState.photoUrl}
                onChange={(e) => handleFormChange("photoUrl", e.target.value)}
                className="ssp-input notice-input-lg"
                placeholder="photos/artists/artist-1.webp"
              />
            </SspField>

            <SspField
              label="Upload photo"
              hint="Choosing a file here overrides the Photo URL above once saved"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedPhotoFile(e.target.files?.[0] ?? null)
                }
                className="ssp-input notice-input-lg"
              />
              {selectedPhotoFile && (
                <p className="notice-editor-subtitle">
                  Selected: {selectedPhotoFile.name}
                </p>
              )}
            </SspField>

            <SspField label="Badge" hint='Short tag, e.g. "DJ NIGHT"'>
              <input
                value={formState.badge}
                onChange={(e) => handleFormChange("badge", e.target.value)}
                className="ssp-input notice-input-lg"
                placeholder="DJ NIGHT"
              />
            </SspField>

            <SspField label="Reveal effect" hint="Animation shown when a visitor unlocks this artist">
              <select
                value={formState.revealVariant}
                onChange={(e) =>
                  handleRevealVariantChange(
                    e.target.value as (typeof BLANK_FORM)["revealVariant"],
                  )
                }
                className="ssp-input notice-input-lg"
              >
                {ARTIST_REVEAL_VARIANTS.map((variant) => (
                  <option key={variant.value} value={variant.value}>
                    {variant.label}
                  </option>
                ))}
              </select>
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
              disabled={saveBusy || !formState.name || !formState.role}
              className={`ssp-btn ssp-btn-primary ${saveBusy || !formState.name || !formState.role ? "ssp-btn-disabled" : ""}`}
            >
              {saveBusy
                ? "Saving..."
                : activeTab === "add"
                  ? "Add artist"
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
          <h1 className="ssp-list-heading">Artists</h1>
          <p className="ssp-list-count">
            {artists.length === 0
              ? "No artists added yet"
              : `${artists.length} artist${artists.length === 1 ? "" : "s"} · the first 4 show in the reveal dialog`}
          </p>
        </div>
        <button onClick={openAddForm} className="ssp-btn ssp-btn-primary">
          + Add artist
        </button>
      </div>

      {artistsError && (
        <div className="ssp-alert ssp-alert-error">{artistsError}</div>
      )}
      {saveSuccess && (
        <div className="ssp-alert ssp-alert-success">✓ {saveSuccess}</div>
      )}

      {artists.length === 0 && !artistsLoading ? (
        <div className="ssp-card ssp-empty">
          <div className="ssp-empty-icon">🎨</div>
          <div className="ssp-empty-title">No artists yet</div>
          <div className="ssp-empty-sub">
            Add your first artist so it shows in the hero reveal dialog.
          </div>
          <button
            onClick={openAddForm}
            className="ssp-btn ssp-btn-primary ssp-mt"
          >
            + Add your first artist
          </button>
        </div>
      ) : (
        <div className="ssp-notice-list">
          {[...artists]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((artist, index) => (
              <div key={artist.id} className="ssp-notice-row">
                <div className="ssp-notice-move-col">
                  <button
                    onClick={() => handleMove(artist, "up")}
                    disabled={index === 0 || reorderBusyId !== null}
                    className="ssp-notice-move-btn"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(artist, "down")}
                    disabled={
                      index === artists.length - 1 || reorderBusyId !== null
                    }
                    className="ssp-notice-move-btn"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>

                <div className="ssp-notice-body">
                  <div className="ssp-notice-title">{artist.name}</div>
                  <div className="ssp-notice-message">{artist.role}</div>
                </div>

                <div className="ssp-event-badges">
                  <span className="ssp-badge">{artist.badge || "—"}</span>
                  <span className="ssp-badge">
                    {ARTIST_REVEAL_VARIANTS.find(
                      (variant) => variant.value === artist.revealVariant,
                    )?.label ?? "Spotlight sweep"}
                  </span>
                  {index >= 4 && (
                    <span className="ssp-badge ssp-badge-hidden">
                      Not in dialog
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openEditForm(artist)}
                  className="ssp-notice-edit-btn"
                  aria-label="Edit artist"
                >
                  ✏️
                </button>

                {deleteConfirmId === artist.id ? (
                  <div className="ssp-notice-confirm">
                    <button
                      onClick={() => handleDelete(artist.id)}
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
                    onClick={() => setDeleteConfirmId(artist.id)}
                    className="ssp-btn ssp-btn-secondary ssp-btn-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
