"use client";

import { useState } from "react";
import { faqItems } from "@/lib/FaqData";

export default function FooterFaqIndex() {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const selectedItem = faqItems[selectedQuestionIndex];

  return (
    <div className="footer-faq" id="faq">
      <span className="footer-col-label">FAQ</span>
      <div className="footer-faq-index">
        <div
          className="footer-faq-list"
          role="tablist"
          aria-label="Frequently asked questions"
        >
          {faqItems.map((item, index) => (
            <button
              key={item.question}
              type="button"
              role="tab"
              aria-selected={index === selectedQuestionIndex}
              className={`footer-faq-list-item${index === selectedQuestionIndex ? " is-active" : ""}`}
              onClick={() => setSelectedQuestionIndex(index)}
            >
              <span className="footer-faq-list-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="footer-faq-list-question">{item.question}</span>
            </button>
          ))}
        </div>
        <div className="footer-faq-answer-pane" role="tabpanel">
          <span className="footer-faq-answer-tag">
            A_{String(selectedQuestionIndex + 1).padStart(2, "0")}
          </span>
          <p className="footer-faq-answer-text">{selectedItem.answer}</p>
        </div>
      </div>
    </div>
  );
}
