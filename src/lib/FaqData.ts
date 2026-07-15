export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What should I bring on the first day?",
    answer:
      "Just carry your ID card (along with your personal belongings) and enjoy the induction! :)",
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
      "IIIT Delhi is at Okhla Industrial Area Phase III, near Govindpuri Metro Station on the Violet Line. Auto-rickshaws and cabs are available from the metro exit. Full address: Okhla Industrial Area Phase 3, New Delhi, Delhi 110020. Refer to the contacts page for more details",
  },
  {
    question: "Is the schedule subject to change after it's published?",
    answer:
      "Yes. The schedule pages sync directly from the master Google Sheet maintained by the induction team. Any changes made to the sheet appear automatically within minutes. Check the schedule pages before each day for the latest programme.",
  },
  {
    question:
      "Will hostel rooms be allotted before induction or after I arrive on campus?",
    answer:
      "Complimentary accommodation is provided during induction. Regular hostel allotment happens after induction, per the eligibility criteria and process published on the institute website.",
  },
];
