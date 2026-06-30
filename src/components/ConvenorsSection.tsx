import Image from "next/image";
import Link from "next/link";

const convenors = [
  {
    name: "ANOUSHKA MALIK",
    role: "Convenor",
    photo: "/photos/team/CONVENOR/ANOUSHKA_MALIK.webp",
  },
  {
    name: "ADITYA KUMAR GIRI",
    role: "Convenor",
    photo: "/photos/team/CONVENOR/ADITYA_GIRI.webp",
  },
  {
    name: "ABHINAV ARORA",
    role: "Treasurer",
    photo: "/photos/team/TREASURER/ABHINAV_ARORA.webp",
  },
  {
    name: "YUVRAJ SINGH",
    role: "General Secretary",
    photo: "/photos/team/GENERAL_SECRETARY/YUVRAJ_SINGH.webp",
  },
];

export default function ConvenorsSection() {
  return (
    <section className="sec-convenors" id="team">
      <div className="container">
        <div className="reveal">
          <span className="sec-tag">FILE: TEAM</span>
          <h2 className="sec-heading">
            MEET THE
            <br />
            TEAM
          </h2>
        </div>

        <div className="convenors-grid reveal">
          {convenors.map((c, i) => (
            <div key={i} className="convenor-card">
              <div className="convenor-photo-wrap">
                <Image
                  src={c.photo}
                  alt={c.name}
                  fill
                  className="convenor-photo-img"
                  sizes="(max-width: 520px) 50vw, (max-width: 900px) 25vw, 260px"
                />
              </div>
              <div className="convenor-info">
                <div className="convenor-name">{c.name}</div>
                <div className="convenor-role">{c.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="convenors-cta reveal">
          <Link href="/team" className="convenors-btn">
            MEET COMPLETE TEAM →
          </Link>
        </div>
      </div>
    </section>
  );
}
