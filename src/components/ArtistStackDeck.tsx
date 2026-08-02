"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArtistRevealVariant } from "@/lib/revealVariants";
import ArtistRevealOverlay from "@/components/reveal/ArtistRevealOverlay";

export interface ArtistStackSlot {
  key: string;
  name: string;
  role: string;
  photoUrl: string;
  badge: string;
  revealVariant: ArtistRevealVariant;
  hasArtist: boolean;
}

interface ArtistStackDeckProps {
  slots: ArtistStackSlot[];
  onDeckEmpty?: () => void;
}

const SWIPE_DISTANCE_THRESHOLD = 90;
const MAX_VISIBLE_BACK_CARDS = 3;
const FIRST_CARD_REVEAL_DELAY_MS = 450;

function restingTransform(stackPosition: number) {
  const clampedPosition = Math.min(stackPosition, MAX_VISIBLE_BACK_CARDS);
  const peeksRight = clampedPosition % 2 === 1;
  const sideOffset = peeksRight ? clampedPosition * 22 : -clampedPosition * 22;
  return {
    x: clampedPosition === 0 ? 0 : sideOffset,
    y: clampedPosition * 10,
    rotate:
      clampedPosition === 0
        ? 0
        : peeksRight
          ? clampedPosition * 4
          : -clampedPosition * 4,
    scale: 1 - clampedPosition * 0.06,
    zIndex: MAX_VISIBLE_BACK_CARDS + 1 - clampedPosition,
  };
}

export default function ArtistStackDeck({
  slots,
  onDeckEmpty,
}: ArtistStackDeckProps) {
  const [remainingCardKeys, setRemainingCardKeys] = useState<string[]>(() =>
    slots.map((slot) => slot.key),
  );
  const [revealedCardKeys, setRevealedCardKeys] = useState<Set<string>>(
    new Set(),
  );
  const cardElementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragStateRef = useRef<{ key: string; startX: number } | null>(null);
  const hasRevealedFirstCardRef = useRef(false);

  useEffect(() => {
    setRemainingCardKeys(slots.map((slot) => slot.key));
    setRevealedCardKeys(new Set());
    hasRevealedFirstCardRef.current = false;
  }, [slots]);

  useEffect(() => {
    const frontCardKey = remainingCardKeys[0];
    if (!frontCardKey || revealedCardKeys.has(frontCardKey)) return;

    if (!hasRevealedFirstCardRef.current) {
      hasRevealedFirstCardRef.current = true;
      const revealTimer = setTimeout(() => {
        setRevealedCardKeys((previousKeys) =>
          new Set(previousKeys).add(frontCardKey),
        );
      }, FIRST_CARD_REVEAL_DELAY_MS);
      return () => clearTimeout(revealTimer);
    }

    setRevealedCardKeys((previousKeys) =>
      new Set(previousKeys).add(frontCardKey),
    );
  }, [remainingCardKeys, revealedCardKeys]);

  useEffect(() => {
    remainingCardKeys.forEach((key, stackPosition) => {
      const cardElement = cardElementRefs.current[key];
      if (!cardElement) return;
      gsap.to(cardElement, {
        ...restingTransform(stackPosition),
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [remainingCardKeys]);

  function removeFrontCard(key: string, direction: 1 | -1) {
    const cardElement = cardElementRefs.current[key];
    if (!cardElement) return;

    gsap.to(cardElement, {
      x: direction * 420,
      rotate: direction * 24,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setRemainingCardKeys((previousKeys) =>
          previousKeys.filter((existingKey) => existingKey !== key),
        );
      },
    });
  }

  function springFrontCardBack(key: string) {
    const cardElement = cardElementRefs.current[key];
    if (!cardElement) return;
    gsap.to(cardElement, {
      ...restingTransform(0),
      duration: 0.45,
      ease: "elastic.out(1, 0.6)",
    });
  }

  function handlePointerDown(
    key: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (remainingCardKeys[0] !== key) return;
    dragStateRef.current = { key, startX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(
    key: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.key !== key) return;
    const deltaX = event.clientX - dragState.startX;
    const cardElement = cardElementRefs.current[key];
    if (!cardElement) return;
    gsap.set(cardElement, { x: deltaX, rotate: deltaX / 16 });
  }

  function handlePointerUp(
    key: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.key !== key) return;
    const deltaX = event.clientX - dragState.startX;
    dragStateRef.current = null;

    if (Math.abs(deltaX) > SWIPE_DISTANCE_THRESHOLD) {
      removeFrontCard(key, deltaX > 0 ? 1 : -1);
    } else {
      springFrontCardBack(key);
    }
  }

  useEffect(() => {
    if (remainingCardKeys.length > 0) return;
    if (!onDeckEmpty) return;
    const closeTimer = setTimeout(onDeckEmpty, 900);
    return () => clearTimeout(closeTimer);
  }, [remainingCardKeys, onDeckEmpty]);

  if (remainingCardKeys.length === 0) {
    return (
      <div className="artist-stack-deck artist-stack-deck-empty">
        <p className="artist-stack-empty-message">ALL ARTISTS REVEALED</p>
      </div>
    );
  }

  return (
    <div className="artist-stack-deck">
      {remainingCardKeys.map((key, stackPosition) => {
        const slot = slots.find((candidate) => candidate.key === key);
        if (!slot) return null;
        const isFrontCard = stackPosition === 0;

        return (
          <div
            key={key}
            ref={(cardElement) => {
              cardElementRefs.current[key] = cardElement;
            }}
            className={`artist-stack-card${slot.hasArtist ? "" : " is-locked"}`}
            style={{
              touchAction: isFrontCard ? "none" : "auto",
              pointerEvents: isFrontCard ? "auto" : "none",
            }}
            onPointerDown={(event) => handlePointerDown(key, event)}
            onPointerMove={(event) => handlePointerMove(key, event)}
            onPointerUp={(event) => handlePointerUp(key, event)}
            onPointerCancel={(event) => handlePointerUp(key, event)}
          >
            {slot.hasArtist ? (
              <div
                className="artist-stack-photo"
                style={{ backgroundImage: `url('${slot.photoUrl}')` }}
              >
                <ArtistRevealOverlay
                  variant={slot.revealVariant}
                  isRevealed={revealedCardKeys.has(key)}
                />
              </div>
            ) : (
              <div className="artist-stack-card-placeholder">
                <span className="artist-lock-icon"></span>
                <span>ARTIST TBA</span>
              </div>
            )}
            <div className="artist-stack-card-info">
              <p className="artist-stack-card-name">
                {slot.hasArtist ? slot.name : "CLASSIFIED"}
              </p>
              <p className="artist-stack-card-role">
                {slot.hasArtist ? slot.role : "Details locked"}
              </p>
              <span className="artist-stack-card-badge">{slot.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
