import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollRevealInit from "@/components/ScrollReveal";
import { allOcMembers, type TeamMember, wholeTeam } from "@/lib/teamData";

const teamNavLinks = [
  { label: "ABOUT", href: "/#about" },
  { label: "SCHEDULE", href: "/#schedule" },
  { label: "TEAM", href: "/team" },
  { label: "BUDDY", href: "/induction-buddies" },
  { label: "CONTACT", href: "/contact" },
];

const FALLBACK_PHOTO = "/photos/mentors/mentor-01.webp";

const membersByDepartment = wholeTeam.reduce<Record<string, TeamMember[]>>(
  (acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  },
  {},
);

function MemberCard({ member }: { member: TeamMember }) {
  const resolvedPhoto = member.photo ?? FALLBACK_PHOTO;
  return (
    <div className="team-member-card">
      <div
        className="team-member-photo"
        style={{ backgroundImage: `url('${resolvedPhoto}')` }}
      />
      <div className="team-member-info">
        <p className="team-member-dept">{member.department}</p>
        <p className="team-member-name">{member.name}</p>
        <p className="team-member-role">{member.role}</p>
        <span className="team-member-tag">TEAM MEMBER</span>
      </div>
    </div>
  );
}

export default function AllMembersPage() {
  return (
    <>
      <Navbar isScrolledByDefault={true} links={teamNavLinks} />

      <PageHero
        title={
          <>
            ALL
            <br />
            MEMBERS
          </>
        }
        subtitles={[
          `${allOcMembers.length}+ MEMBERS · INDUCTION 2026 · IIIT DELHI · CLASS OF 2028`,
        ]}
        extraContent={
          <Link href="/team" className="sched-back-link">
            BACK TO TEAM OVERVIEW
          </Link>
        }
      />

      {Object.entries(membersByDepartment).map(([department, members]) => (
        <section key={department} className="sched-page-body team-page-body">
          <div className="container">
            <div className="reveal">
              <span className="sec-tag">FILE: {department}</span>
              <h2 className="all-members-dept-heading">{department}</h2>
              <p className="talks-sub">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="all-members-grid">
              {members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "FILE / ALL MEMBERS",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-ROSTER · FILE / ALL MEMBERS · CONFIDENTIAL WHEN PRINTED"
        simpleNavLinks={[
          { text: "MAIN PAGE", href: "/" },
          { text: "TEAM OVERVIEW", href: "/team" },
          { text: "BUDDY", href: "/induction-buddies" },
          { text: "CONTACT", href: "/contact" },
          { text: "B.TECH SCHEDULE", href: "/schedule-btech" },
          { text: "PG SCHEDULE", href: "/schedule-pg" },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
