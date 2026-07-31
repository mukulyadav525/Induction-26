import Image from "next/image";
import Link from "next/link";
import LandingSectionCard from "@/components/LandingSectionCard";

const convenors = [
  {
    name: "Anoushka Malik",
    role: "Convenor",
    photo: "/photos/team/CONVENOR/ANOUSHKA_MALIK.webp",
  },
  {
    name: "Aditya Kumar Giri",
    role: "Convenor",
    photo: "/photos/team/CONVENOR/ADITYA_GIRI.webp",
  },
  {
    name: "Abhinav Arora",
    role: "Treasurer",
    photo: "/photos/team/TREASURER/ABHINAV_ARORA.webp",
  },
  {
    name: "Yuvraj Singh",
    role: "General Secretary",
    photo: "/photos/team/GENERAL_SECRETARY/YUVRAJ_SINGH.webp",
  },
];

export default function ConvenorsSection() {
  return (
    <LandingSectionCard
      sectionId="team"
      sectionClassName="sec-convenors"
      tagText="FILE: TEAM"
      title="MEET THE TEAM"
    >
      <div className="convenors-grid reveal">
        {convenors.map((convenor, index) => (
          <div key={index} className="convenor-card">
            <div className="convenor-photo-wrap">
              <Image
                src={convenor.photo}
                alt={convenor.name}
                fill
                className="convenor-photo-img"
                sizes="(max-width: 520px) 50vw, (max-width: 900px) 25vw, 260px"
              />
            </div>
            <div className="convenor-info">
              <div className="convenor-name">{convenor.name}</div>
              <div className="convenor-role">{convenor.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="convenors-cta reveal">
        <Link href="/team" className="convenors-btn">
          MEET COMPLETE TEAM →
        </Link>
      </div>
    </LandingSectionCard>
  );
}
