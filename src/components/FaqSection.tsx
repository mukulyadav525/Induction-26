"use client";

const faqItems = [
  {
    question: "What should I bring on the first day?",
    answer:
      "Bring your admission offer letter, original ID proof and photocopies, passport-size photographs, and hostel allotment details if applicable. A complete packing checklist will be shared via the official student portal before induction begins.",
  },
  {
    question: "Are B.Tech and PG inductions on the same days?",
    answer:
      "No. B.Tech and PG (M.Tech / Ph.D) inductions run on separate dates with distinct programmes tailored to each track. Use the B.TECH / PG TRACK buttons in the nav to open the correct full schedule for your programme.",
  },
  {
    question: "When will Induction Buddy assignments be announced?",
    answer:
      "Induction Buddy assignments are revealed during induction itself, in the dedicated Induction Buddies session. You will meet your buddy in person — yet another reason not to miss it.",
  },
  {
    question: "How do I get to the IIIT Delhi campus?",
    answer:
      "IIIT Delhi is at Okhla Industrial Area Phase III, near Govindpuri Metro Station on the Violet Line. Auto-rickshaws and cabs are available from the metro exit. Full address: Okhla Industrial Area Phase 3, New Delhi, Delhi 110020.",
  },
  {
    question: "Will the schedule change after it's published?",
    answer:
      "Yes. The schedule pages sync directly from the master Google Sheet maintained by the induction team. Any changes made to the sheet appear automatically within minutes. Check the schedule pages before each day for the latest programme.",
  },

  {
    question:
      "Will hostel rooms be allotted before induction or after I arrive on campus?",
    answer:
      "Please keep an eye on your email and the official induction website for further updates regarding the exact dates and schedule.",
  },
];

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
          {faqItems.map((item, index) => (
            <div className="faq-item reveal" key={index}>
              <button
                className="faq-q"
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                {item.question}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
