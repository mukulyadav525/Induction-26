// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import PageHero from "@/components/PageHero";
// import ScrollRevealInit from "@/components/ScrollReveal";

// const mentorsNavLinks = [
//   { label: "ABOUT", href: "/#about" },
//   { label: "SCHEDULE", href: "/#schedule" },
//   // { label: "BUDDY", href: "/induction-buddies" },
//   { label: "INFO", href: "/#info" },

//   { label: "CONTACT", href: "/contact" },
// ];

// const mentorGroups = [
//   { groupNumber: "01" },
//   { groupNumber: "02" },
//   { groupNumber: "03" },
//   { groupNumber: "04" },
//   { groupNumber: "05" },
//   { groupNumber: "06" },
//   { groupNumber: "07" },
//   { groupNumber: "08" },
// ];

// export default function MentorsPage() {
//   return (
//     <>
//       <Navbar isScrolledByDefault={true} links={mentorsNavLinks} />

//       <PageHero
//         title={
//           <>
//             INDUCTION
//             <br />
//             BUDDIES
//           </>
//         }
//         subtitles={[
//           "EVERY INCOMING STUDENT IS PLACED INTO A GROUP LED BY A SENIOR MENTOR · GROUPS REVEALED DURING INDUCTION",
//         ]}
//       />

// <section className="sec-talks sched-page-body" id="mentor-groups">
//   <div className="container">
//     <div className="mentor-grid">
//       {mentorGroups.map((group) => (
//         <div className="mentor-card" key={group.groupNumber}>
//           <div
//             className="mentor-photo"
//             style={{
//               backgroundImage: `url('photos/mentors/mentor-01.webp'), url('photos/mentors/images.webp')`,
//             }}
//           ></div>
//           <div className="mentor-info">
//             <p className="mentor-group-name">GROUP {group.groupNumber}</p>
//             <p className="mentor-lead">
//               Lead mentor name &amp; year to be announced
//             </p>
//             <span className="mentor-tag">LEAD MENTOR</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

//       <Footer
//         stripItems={[
//           "INDUCTION 2026",
//           "CLASS OF 2030",
//           "IIIT DELHI",
//           "FILE / INDUCTION BUDDIES",
//         ]}
//         bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2030"
//         bottomRight="DOC ID: IND26-2030 · FILE / MENTOR CONNECT · CONFIDENTIAL WHEN PRINTED"
//         simpleNavLinks={[
//           { text: "MAIN PAGE", href: "/" },
//           { text: "ABOUT", href: "/#about" },
//           { text: "BUDDY", href: "/induction-buddies" },
//           { text: "CONTACT", href: "/contact" },
//           { text: "B.TECH SCHEDULE ↗", href: "/schedule-btech" },
//           { text: "PG SCHEDULE ↗", href: "/schedule-pg" },
//         ]}
//       />
//       <ScrollRevealInit />
//     </>
//   );
// }
import React from "react";

const MentorsPage = () => {
  return <div>MentorsPage</div>;
};

export default MentorsPage;
