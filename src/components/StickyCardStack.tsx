"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { HighlightCard } from "@/lib/highlightCardStackData";

interface StickyCardStackProps {
  cards: HighlightCard[];
}

function scaleForProgress(
  scrollProgress: number,
  rangeStart: number,
  targetScale: number,
): number {
  if (scrollProgress <= rangeStart) return 1;
  const rangeFraction = (scrollProgress - rangeStart) / (1 - rangeStart);
  return 1 - rangeFraction * (1 - targetScale);
}

export default function StickyCardStack({ cards }: StickyCardStackProps) {
  const outerContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const outerContainer = outerContainerRef.current;
    if (!outerContainer) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: outerContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        cards.forEach((card, cardIndex) => {
          const cardElement = cardRefs.current[cardIndex];
          if (!cardElement) return;
          const targetScale = Math.max(
            0.5,
            1 - (cards.length - cardIndex - 1) * 0.1,
          );
          const rangeStart = cardIndex / cards.length;
          const cardScale = scaleForProgress(
            self.progress,
            rangeStart,
            targetScale,
          );
          gsap.set(cardElement, { scale: cardScale });
        });
      },
    });

    return () => scrollTrigger.kill();
  }, [cards]);

  return (
    <div ref={outerContainerRef} className="sticky-card-stack">
      {cards.map((card, cardIndex) => (
        <div key={card.title} className="sticky-card-sticky-wrapper">
          <div
            ref={(element) => {
              cardRefs.current[cardIndex] = element;
            }}
            className="landing-card-container sticky-card-item"
            style={{
              marginTop: cardIndex * 20,
              borderTopColor: card.color,
            }}
          >
            <div className="sticky-card-content">
              <div className="sticky-card-text">
                <h3 className="sec-heading">{card.title}</h3>
                <p className="about-copy">{card.description}</p>
                <a href={card.link} className="sticky-card-link">
                  LEARN MORE
                </a>
              </div>
              <div className="sticky-card-image">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
