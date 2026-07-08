const speakers = [
  {
    name: "Dr. PANKAJ JALOTE",
    role: "Founding Director of IIIT-Delhi",
    photo: "photos/speakers/speaker-1.webp",
    badge: "KEYNOTE",
    linkedin: "https://www.linkedin.com/in/pankaj-jalote-0924782/",
  },
  {
    name: "Dr. RAJDEEP MUKHERJEE",
    role: "Applied Scientist II @ Amazon",
    photo: "photos/speakers/speaker-2.webp",
    badge: "ALUMNI",
    linkedin: "https://www.linkedin.com/in/rajdeepmukherjee89/",
  },
  {
    name: "Mimansha Das",
    role: "AI Engineer @ Trademo",
    photo: "photos/speakers/speaker-3.webp",
    badge: "ALUMNI",
    linkedin: "https://www.linkedin.com/in/mimansha-das-6963951ab/",
  },
  // {
  //   name: "Saumya Singh",
  //   role: "Tech Influencer",
  //   photo: "photos/speakers/speaker-4.webp",
  //   badge: "KEYNOTE",
  // },
  // {
  //   name: "Ankur Warikoo",
  //   role: "",
  //   photo: "photos/speakers/speaker-5.webp",
  //   badge: "KEYNOTE",
  // },
];

export default function TalksSection() {
  return (
    <section className="sec-talks" id="talks">
      <div className="container">
        <div className="reveal">
          <span className="sec-tag">FILE: SPEAKERS</span>
          <h2 className="sec-heading">
            TALKS &amp;
            <br />
            SESSIONS
          </h2>
          <p className="talks-sub">
            Distinguished voices who will address the incoming class of 2028.
            Full lineup to be announced as induction approaches.
          </p>
        </div>
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
                
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="speaker-linkedin"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
