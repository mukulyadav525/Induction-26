import LandingSectionCard from "@/components/LandingSectionCard";

const speakers = [
  {
    name: "Dr. Pankaj Jalote",
    role: "Founding Director of IIIT-Delhi",
    photo: "photos/speakers/speaker-1.webp",
    badge: "KEYNOTE",
    linkedin: "https://www.linkedin.com/in/pankaj-jalote-0924782/",
  },
  {
    name: "Ankur Warikoo",
    role: "Entrepreneur",
    photo: "photos/speakers/speaker-3.webp",
    badge: "KEYNOTE",
    linkedin: "https://www.linkedin.com/in/warikoo/",
  },
  {
    name: "Saumya Singh",
    role: "Tech Influencer",
    photo: "photos/speakers/speaker-4.webp",
    badge: "INDUSTRY GUEST",
    linkedin: "https://www.linkedin.com/in/saumya1singh/",
  },
];

export default function TalksSection() {
  return (
    <LandingSectionCard
      sectionId="talks"
      sectionClassName="sec-talks"
      tagText="FILE: SPEAKERS"
      title="TALKS & SESSIONS"
      subtitle="Distinguished voices who will address the incoming class of 2028. Full lineup to be announced as induction approaches."
      subtitleClassName="talks-sub"
    >
      <div className="speakers-grid" id="speakers-grid">
        {speakers.map((speaker, index) => (
          <div key={index} className="speaker-card is-placeholder reveal">
            <div
              className="speaker-photo"
              style={{
                backgroundImage: `url('${speaker.photo}'), url('photos/speakers/images.webp')`,
              }}
            ></div>
            <div className="speaker-info">
              <p className="speaker-name">{speaker.name}</p>
              <p className="speaker-role">{speaker.role}</p>
              <div className="speaker-footer">
                <span className="speaker-badge">{speaker.badge}</span>
                {speaker.linkedin ? (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="speaker-linkedin"
                  >
                    LinkedIn ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </LandingSectionCard>
  );
}
