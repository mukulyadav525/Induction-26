const speakers = [
  {
    name: "Dr. PANKAJ JALOTE",
    role: "Founding Director of IIIT-Delhi",
    photo: "photos/speakers/speaker-1.webp",
    badge: "KEYNOTE",
  },
  {
    name: "Dr. RAJDEEP MUKHERJEE",
    role: "Applied Scientist II @ Amazon",
    photo: "photos/speakers/speaker-2.webp",
    badge: "ALUMNI",
  },
  {
    name: "Mimansha Das",
    role: "AI Engineer @ Trademo",
    photo: "photos/speakers/speaker-3.webp",
    badge: "ALUMNI",
  },
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
                <span className="speaker-badge">{speaker.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
