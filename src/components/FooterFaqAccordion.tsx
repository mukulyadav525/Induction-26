"use client";

import { useState } from "react";
import { faqItems } from "@/lib/FaqData";

export default function FooterFaqAccordion() {
  const [flippedQuestionIndexes, setFlippedQuestionIndexes] = useState<
    Set<number>
  >(new Set());

  function toggleCardFlip(index: number) {
    setFlippedQuestionIndexes((previousFlippedIndexes) => {
      const nextFlippedIndexes = new Set(previousFlippedIndexes);
      if (nextFlippedIndexes.has(index)) {
        nextFlippedIndexes.delete(index);
      } else {
        nextFlippedIndexes.add(index);
      }
      return nextFlippedIndexes;
    });
  }

  return (
    <div className="footer-faq" id="faq">
      <span className="footer-col-label">FAQ</span>
      <div className="footer-faq-grid">
        {faqItems.map((item, index) => {
          const isFlipped = flippedQuestionIndexes.has(index);
          return (
            <button
              key={item.question}
              type="button"
              className={`footer-faq-card${isFlipped ? " is-flipped" : ""}`}
              onClick={() => toggleCardFlip(index)}
              aria-pressed={isFlipped}
            >
              <span className="footer-faq-card-pin" />
              <div className="footer-faq-card-inner">
                <div className="footer-faq-card-face footer-faq-card-front">
                  <span className="footer-faq-card-icon">+</span>
                  <span className="footer-faq-card-question">
                    {item.question}
                  </span>
                </div>
                <div className="footer-faq-card-face footer-faq-card-back">
                  <span className="footer-faq-card-answer">{item.answer}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
