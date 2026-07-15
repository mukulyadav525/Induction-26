"use client";

import { faqItems } from "@/lib/FaqData";

export default function FaqSection() {
  function toggleFAQ(btn: HTMLButtonElement) {
    const answer = btn.nextElementSibling as HTMLElement;
    const icon = btn.querySelector(".faq-icon") as HTMLElement;
    const wasOpen = answer.classList.contains("open");
    document.querySelectorAll(".faq-a.open").forEach((a) => {
      a.classList.remove("open");
      const ic = (a.previousElementSibling as HTMLElement)?.querySelector(
        ".faq-icon",
      ) as HTMLElement;
      if (ic) ic.textContent = "+";
    });
    if (!wasOpen) {
      answer.classList.add("open");
      if (icon) icon.textContent = "×";
    }
  }

  return (
    <section className="sec-faq" id="faq">
      <div className="container">
        <div className="reveal">
          <span className="sec-tag">FILE: FAQ</span>
          <h2 className="sec-heading">
            CLASSIFIED
            <br />
            Q&amp;A
          </h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const questionCode = `Q.${String(index + 1).padStart(2, "0")}`;
            return (
              <div className="faq-item reveal" key={index}>
                <button
                  className="faq-q"
                  onClick={(e) => toggleFAQ(e.currentTarget)}
                >
                  <span className="faq-q-mark">
                    <span className="faq-tab"></span>
                    <span className="faq-question-text">{item.question}</span>
                  </span>
                  <span className="faq-code">{questionCode}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-a">{item.answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
