export interface HighlightCard {
  title: string;
  description: string;
  image: string;
  color: string;
  link: string;
}

export const highlightCardStackData: HighlightCard[] = [
  {
    title: "MEET YOUR MENTORS",
    description:
      "Senior students guide you in your first weeks. Ask them about courses, hostels, and campus life.",
    image: "/photos/campus/library.webp",
    color: "var(--lime)",
    link: "/team",
  },
  {
    title: "FULL EVENT SCHEDULE",
    description:
      "See every talk, workshop, and session planned for induction week, day by day.",
    image: "/photos/campus/academic-block.webp",
    color: "var(--teal)",
    link: "/schedule-btech",
  },
  {
    title: "EXPLORE THE CAMPUS",
    description:
      "Walk through the academic block, library, and auditorium before you even arrive.",
    image: "/photos/campus/auditorium.webp",
    color: "var(--ink)",
    link: "#campus",
  },
];
