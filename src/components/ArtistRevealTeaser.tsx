"use client";

import { useEffect, useRef, useState } from "react";
import { DbArtistReveal } from "@/lib/artistsDb";
import {
  ArtistRevealVariant,
  DEFAULT_ARTIST_REVEAL_VARIANT,
} from "@/lib/revealVariants";
import ArtistRevealOverlay from "@/components/reveal/ArtistRevealOverlay";
import ArtistStackDeck from "@/components/ArtistStackDeck";

const EMPTY_SLOT_COUNT = 4;

interface ArtistSlot {
  key: string;
  name: string;
  role: string;
  photoUrl: string;
  badge: string;
  revealVariant: ArtistRevealVariant;
  hasArtist: boolean;
}

function buildArtistSlots(artists: DbArtistReveal[]): ArtistSlot[] {
  const slots: ArtistSlot[] = [];
  for (let slotIndex = 0; slotIndex < EMPTY_SLOT_COUNT; slotIndex++) {
    const artist = artists[slotIndex];
    if (artist) {
      slots.push({
        key: String(artist.id),
        name: artist.name,
        role: artist.role,
        photoUrl: artist.photoUrl,
        badge: artist.badge,
        revealVariant: artist.revealVariant ?? DEFAULT_ARTIST_REVEAL_VARIANT,
        hasArtist: true,
      });
    } else {
      slots.push({
        key: `empty-slot-${slotIndex}`,
        name: "ARTIST TBA",
        role: "Announcement coming soon",
        photoUrl: "",
        badge: "TBA",
        revealVariant: DEFAULT_ARTIST_REVEAL_VARIANT,
        hasArtist: false,
      });
    }
  }
  return slots;
}

export default function ArtistRevealTeaser() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [artistSlots, setArtistSlots] = useState<ArtistSlot[]>(
    buildArtistSlots([]),
  );
  const [revealedSlotKeys, setRevealedSlotKeys] = useState<Set<string>>(
    new Set(),
  );
  const [isMobileStackOpen, setIsMobileStackOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(
    null,
  );

  function revealSlot(slotKey: string) {
    setRevealedSlotKeys((prev) => new Set(prev).add(slotKey));
  }

  useEffect(() => {
    let didUnmount = false;
    setIsDesktopViewport(window.innerWidth >= 900);

    async function loadFeaturedArtists() {
      try {
        const response = await fetch("/api/artists");
        const data = await response.json();
        if (!didUnmount) {
          setArtistSlots(buildArtistSlots(data.artists ?? []));
        }
      } catch {
        if (!didUnmount) setArtistSlots(buildArtistSlots([]));
      }
    }

    loadFeaturedArtists();

    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    function restoreBackgroundScroll() {
      document.body.style.overflow = "";
    }

    dialogElement.addEventListener("close", restoreBackgroundScroll);
    return () => {
      didUnmount = true;
      dialogElement.removeEventListener("close", restoreBackgroundScroll);
      restoreBackgroundScroll();
    };
  }, []);

  function openRevealDialog() {
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }

  function closeRevealDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      closeRevealDialog();
    }
  }

  function openMobileStack() {
    document.body.style.overflow = "hidden";
    setIsMobileStackOpen(true);
  }

  function closeMobileStack() {
    document.body.style.overflow = "";
    setIsMobileStackOpen(false);
  }

  return (
    <>
      <div className="reveal-desktop-only">
        <div className="reveal-container">
          <img
            src="/assets/hero/hero_artist_reveal_btn.png"
            onClick={openRevealDialog}
            width={isDesktopViewport ? 750 : 450}
            alt=""
          />
        </div>
        <dialog
          ref={dialogRef}
          className="hero-notice-dialog artist-reveal-dialog"
          onClick={handleBackdropClick}
          aria-label="Artist reveal"
        >
          <div className="advisory-modal-card artist-reveal-modal-card">
            <div className="modal-dossier-header">
              <div className="dossier-meta">
                <div className="dossier-stamp">DOCUMENT ID: IND26-ARTISTS</div>
                <div className="dossier-classification">
                  ARTIST LINEUP // CLASSIFIED UNTIL REVEAL
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeRevealDialog}
                aria-label="Close modal"
              >
                ✕ [CLOSE]
              </button>
            </div>
            <div className="modal-divider-rule" />
            <div className="modal-title-row">
              <h2 className="modal-heading">ARTIST REVEAL</h2>
              <p className="modal-subtitle">
                TAP REVEAL TO UNLOCK EACH ARTIST.
              </p>
            </div>
            <div className="artist-lock-grid">
              {artistSlots.map((slot) => {
                const isSlotRevealed = revealedSlotKeys.has(slot.key);
                return (
                  <div key={slot.key} className="artist-lock-slot">
                    <div
                      className={`artist-lock-card ${isSlotRevealed ? "is-revealed" : ""}`}
                    >
                      <div
                        className="speaker-photo"
                        style={
                          slot.hasArtist
                            ? { backgroundImage: `url('${slot.photoUrl}')` }
                            : undefined
                        }
                      >
                        {slot.hasArtist ? (
                          <ArtistRevealOverlay
                            variant={slot.revealVariant}
                            isRevealed={isSlotRevealed}
                          />
                        ) : (
                          !isSlotRevealed && (
                            <span className="artist-lock-icon"></span>
                          )
                        )}
                      </div>
                      <div className="speaker-info">
                        <p className="speaker-name">
                          {isSlotRevealed ? slot.name : "CLASSIFIED"}
                        </p>
                        <p className="speaker-role">
                          {isSlotRevealed ? slot.role : "Details locked"}
                        </p>
                        <div className="speaker-footer">
                          <span className="speaker-badge">{slot.badge}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="artist-lock-reveal-btn"
                      onClick={() => revealSlot(slot.key)}
                      disabled={isSlotRevealed}
                    >
                      {isSlotRevealed ? "REVEALED" : "REVEAL"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </dialog>
      </div>
      <div className="reveal-mobile-only">
        <div className="reveal-container">
          <img
            src="/assets/hero/hero_artist_reveal_btn.png"
            onClick={openMobileStack}
            width={450}
            alt=""
          />
        </div>
        {isMobileStackOpen && (
          <div
            className="artist-stack-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeMobileStack();
            }}
          >
            <button
              type="button"
              className="artist-stack-overlay-close"
              onClick={closeMobileStack}
              aria-label="Close artist reveal"
            >
              ✕ [CLOSE]
            </button>
            <ArtistStackDeck
              slots={artistSlots}
              onDeckEmpty={closeMobileStack}
            />
          </div>
        )}
      </div>
    </>
  );
}
