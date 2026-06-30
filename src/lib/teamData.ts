export interface TeamMember {
  name: string;
  role: string;
  department: string;
  photo: string | null;
  email: string;
}

export interface SAOfficial {
  name: string;
  title: string;
  adjective: string;
  photo: string | null;
  email: string;
}

export interface OcSubsection {
  id: string;
  tag: string;
  heading: string;
  adjective: string;
  members: TeamMember[];
}

export interface TeamLead extends TeamMember {
  department:
    | "Operations"
    | "Nirvana"
    | "Events"
    | "Design"
    | "PR"
    | "Ambience"
    | "Web Development"
    | "Sponsorship"
    | "Mentor";
}

export const convenorMembers: TeamMember[] = [
  {
    name: "Aditya Giri",
    role: "Convenor",
    department: "CONVENOR",
    photo: "/photos/team/CONVENOR/ADITYA_GIRI.webp",
    email: "",
  },
  {
    name: "Anoushka Malik",
    role: "Convenor",
    department: "CONVENOR",
    photo: "/photos/team/CONVENOR/ANOUSHKA_MALIK.webp",
    email: "",
  },
  {
    name: "Aditya Kaushik",
    role: "Overall Mentor",
    department: "OVERALL MENTOR",
    photo: "/photos/team/OVERALL MENTOR/ADITYA_KAUSHIK.webp",
    email: "",
  },
];

export const saOfficeMembers: SAOfficial[] = [
  {
    name: "Dr. Kiriti Kanjilal",
    email: "kanjilal@iiitd.ac.in",
    title: "Dean of Student Affairs (DoSA)",
    adjective: "Visionary",
    photo: "/photos/sa/SA-1.jpg",
  },
  {
    name: "Jagadanand Dwivedi",
    email: "jagadanand@iiitd.ac.in",
    title: "Junior Administrative Officer (SG) (Student Affairs)",
    adjective: "Steadfast",
    photo: "/photos/sa/SA-2.jpg",
  },
  {
    name: "Sonal Garg",
    email: "sonal@iiitd.ac.in",
    title: "Junior Administrative Officer (SG) (Student Affairs)",
    adjective: "Precise",
    photo: "/photos/sa/SA-3.jpg",
  },
];

export const ocSubsections: OcSubsection[] = [
  {
    id: "oc-secretariat",
    tag: "FILE: Secretariat",
    heading: "SECRETARIAT",
    adjective: "Legendary",
    members: [
      {
        name: "Abhinav Arora",
        role: "Treasurer",
        department: "FINANCE",
        photo: "/photos/team/TREASURER/ABHINAV_ARORA.webp",
        email: "abhinav24020@iiitd.ac.in",
      },
      {
        name: "Yuvraj Singh",
        role: "General Secretary",
        department: "SECRETARIAT",
        photo: "/photos/team/GENERAL_SECRETARY/YUVRAJ_SINGH.webp",
        email: "yuvraj24638@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-operations",
    tag: "FILE: Operations",
    heading: "OPERATIONS",
    adjective: "Relentless",
    members: [
      {
        name: "Dhruv Tanwar",
        role: "Operations OC",
        department: "OPERATIONS",
        photo: "/photos/team/OPS/DHRUV_TANWAR.webp",
        email: "dhruv24192@iiitd.ac.in",
      },
      {
        name: "Achintya Rajput",
        role: "Operations OC",
        department: "OPERATIONS",
        photo: "/photos/team/OPS/ACHINTYA_RAJPUT.webp",
        email: "achintya24025@iiitd.ac.in",
      },
      {
        name: "Deepanshu Singh",
        role: "Operations OC",
        department: "OPERATIONS",
        photo: "/photos/team/OPS/DEEPANSHU_SINGH.webp",
        email: "deepanshu24178@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-design",
    tag: "FILE: Design",
    heading: "DESIGN",
    adjective: "Stunning",
    members: [
      {
        name: "Dharohar Mehta",
        role: "Design OC",
        department: "DESIGN",
        photo: "/photos/team/DESIGN/DHAROHAR_MEHTA.webp",
        email: "dharohar24186@iiitd.ac.in",
      },
      {
        name: "Kanha",
        role: "Design OC",
        department: "DESIGN",
        photo: "/photos/team/DESIGN/KANHA.webp",
        email: "kanha23267@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-nirvana",
    tag: "FILE: Nirvana",
    heading: "NIRVANA",
    adjective: "Ethereal",
    members: [
      {
        name: "Divij Yadav",
        role: "Nirvana OC",
        department: "NIRVANA",
        photo: "/photos/team/NIRVANA/DIVIJ_YADAV.webp",
        email: "divij24199@iiitd.ac.in",
      },
    ],
  },

  {
    id: "oc-events",
    tag: "FILE: Events",
    heading: "EVENTS",
    adjective: "Electric",
    members: [
      {
        name: "Prarthna Sharma",
        role: "Events OC",
        department: "EVENTS",
        photo: "/photos/team/EVENTS/PRARTHNA_SHARMA.webp",
        email: "prarthna24427@iiitd.ac.in",
      },
      {
        name: "Shradul Sharma",
        role: "Events OC",
        department: "EVENTS",
        photo: "/photos/team/EVENTS/SHRADUL_SHARMA.webp",
        email: "shradul24538@iiitd.ac.in",
      },
      {
        name: "Taksh Dalal",
        role: "Events OC",
        department: "EVENTS",
        photo: "/photos/team/EVENTS/TAKSH_DALAL.webp",
        email: "Taksh24576@iiitd.ac.in",
      },
    ],
  },

  {
    id: "oc-pr",
    tag: "FILE: Public Relations",
    heading: "PUBLIC RELATIONS",
    adjective: "Magnetic",
    members: [
      {
        name: "Ariv Gupta",
        role: "PR OC",
        department: "PUBLIC RELATIONS",
        photo: "/photos/team/PR/ARIV_GUPTA.webp",
        email: "ariv24103@iiitd.ac.in",
      },
      {
        name: "Eshaan",
        role: "PR OC",
        department: "PUBLIC RELATIONS",
        photo: "/photos/team/PR/ESHAAN.webp",
        email: "eshaan24209@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-ambience",
    tag: "FILE: Ambience",
    heading: "AMBIENCE",
    adjective: "Atmospheric",
    members: [
      {
        name: "Dhruv Peshin",
        role: "Ambience OC",
        department: "AMBIENCE",
        photo: "/photos/team/AMBIENCE/DHRUV_PESHIN.webp",
        email: "dhruv24191@iiitd.ac.in",
      },
      {
        name: "Nakul Zutshi",
        role: "Ambience OC",
        department: "AMBIENCE",
        photo: "/photos/team/AMBIENCE/NAKUL_ZUTSHI.webp",
        email: "nakul24361@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-webdev",
    tag: "FILE: Web Development",
    heading: "WEB DEV",
    adjective: "Obsessive",
    members: [
      {
        name: "Utkarsh Arora",
        role: "Web Development OC",
        department: "WEB DEV",
        photo: "/photos/team/WEBDEV/UTKARSH_ARORA.webp",
        email: "utkarsh24595@iiitd.ac.in",
      },
      {
        name: "Vasu Mehta",
        role: "Web Development OC",
        department: "WEB DEV",
        photo: "/photos/team/WEBDEV/VASU_MEHTA.webp",
        email: "vasu24610@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-mentor",
    tag: "FILE: Mentor Coordination",
    heading: "MENTOR",
    adjective: "Warm",
    members: [
      {
        name: "Naveen Jangra",
        role: "Mentor OC",
        department: "MENTOR",
        photo: "/photos/team/BUDDY/NAVEEN_JANGRA.webp",
        email: "naveen24375@iiitd.ac.in",
      },
      {
        name: "Apoorv Sharma",
        role: "Mentor OC",
        department: "MENTOR",
        photo: "/photos/team/BUDDY/APOORV_SHARMA.webp",
        email: "apoorv24097@iiitd.ac.in",
      },
    ],
  },
  {
    id: "oc-sponsorship",
    tag: "FILE: Sponsorship",
    heading: "SPONSORSHIP",
    adjective: "Persuasive",
    members: [
      {
        name: "Garv Jain",
        role: "Sponsorship OC",
        department: "SPONSORSHIP",
        photo: "/photos/team/SPONS/GARV_JAIN.webp",
        email: "garv24216@iiitd.ac.in",
      },
      {
        name: "Aashish Arya",
        role: "Sponsorship OC",
        department: "SPONSORSHIP",
        photo: "/photos/team/SPONS/AASHISH.webp",
        email: "aashish24011@iiitd.ac.in",
      },
    ],
  },
];

export const allOcMembers: TeamMember[] = ocSubsections.flatMap(
  (subsection) => subsection.members,
);

export const allLeads: TeamLead[] = Array.from({ length: 10 }, (_, i) => {
  return {
    name: `Placeholder name ${i}`,
    email: "EMAIL",
    department: "Web Development",
    role: "ROLE: Placeholder until I recieve more info",
    photo: "/photos/mentors/mentor-01.webp",
  };
});

export const allOTs: TeamLead[] = Array.from({ length: 10 }, (_, i) => {
  return {
    name: `Placeholder name ${i}`,
    email: "EMAIL",
    department: "Web Development",
    role: "ROLE: Placeholder until I recieve more info",
    photo: "/photos/mentors/mentor-01.webp",
  };
});

export const wholeTeam: TeamMember[] = [
  // ...convenorMembers,
  // ...allOcMembers,
  // ...allLeads,
  ...allOTs,
];
// console.log(wholeTeam);
