export interface AdvisoryItem {
  id: string;
  code: string;
  tag: string;
  question: string;
  answerSummary: string;
  answerDetail: string;
  statusChip: string;
  chipColor: "orange" | "lime";
}

export const ADVISORIES: AdvisoryItem[] = [
  {
    id: "fees",
    code: "ADM-01",
    tag: "FEE TIMELINE & PAYMENT",
    question: "What is the last date to pay the fees, and how can students make the payment?",
    answerSummary: "Kindly wait for portal updates & monitor your registered email ID.",
    answerDetail:
      "The exact payment deadline and online fee portal links are being updated by the administration. Kindly wait for official updates on this site and keep regular check on your registered university mail ID for payment links and timelines.",
    statusChip: "UPDATES PENDING",
    chipColor: "orange",
  },
  {
    id: "hostels",
    code: "HST-02",
    tag: "HOSTEL ALLOTMENTS",
    question: "When will permanent hostel allotments be announced?",
    answerSummary: "Temporary lodging provided initially; permanent allotment dates via email.",
    answerDetail:
      "For initial onboarding during induction week, all eligible students will be provided with temporary hostel accommodation. Kindly wait for updates on the site and keep regular check on your registered mail ID for permanent room allotment schedules and guidelines.",
    statusChip: "TEMP HOSTEL PROVIDED",
    chipColor: "lime",
  },
];
