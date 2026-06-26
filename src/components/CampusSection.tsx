const campusPhotos = [
  {
    className: "campus-photo cp-tall",
    src: "photos/campus/academic-block.jpg",
    fallback: "photos/campus/academic.png",
    label: "ACADEMIC BLOCK",
  },
  {
    className: "campus-photo",
    src: "photos/campus/auditorium.jpg",
    fallback: "photos/campus/oat.jpg",
    label: "AUDITORIUM & LIBRARY",
  },
  {
    className: "campus-photo",
    src: "photos/campus/library.jpg",
    fallback: "photos/campus/lhc.jpg",
    label: "LHC",
  },
  {
    className: "campus-photo cp-wide",
    src: "photos/campus/sports-complex.jpg",
    fallback: "photos/campus/rnd.jpg",
    label: "RESEARCH AND DEVELOPMENT BUILDING",
  },
];

export default function CampusSection() {
  return (
    <section className="sec-campus" id="campus">
      <div className="container">
        <div className="reveal">
          <span className="sec-tag sec-tag--light">FILE: CAMPUS</span>
          <h2 className="sec-heading sec-heading--light">
            IIIT DELHI
            <br />
            CAMPUS
          </h2>
          <p className="campus-sub">
            A compact, vibrant campus in South Delhi — everything within walking
            distance, everyone within reach.
          </p>
        </div>

        <div className="campus-grid reveal">
          {campusPhotos.map((photo, index) => (
            <div key={index} className={photo.className}>
              <div
                className="cp-inner"
                style={{
                  backgroundImage: `url('${photo.src}'), url('${photo.fallback}')`,
                }}
              ></div>
              <span className="cp-label">{photo.label}</span>
            </div>
          ))}
        </div>

        <div className="campus-address reveal">
          <div className="ca-left">
            <span className="ca-label">ADDRESS</span>
            <span className="ca-text">
              Okhla Industrial Area Phase III,
              <br />
              New Delhi, Delhi — 110020
            </span>
          </div>
          <div className="ca-divider"></div>
          <div className="ca-right">
            <span className="ca-label">NEAREST METRO</span>
            <span className="ca-text">
              Govindpuri Station
              <br />
              Violet Line
            </span>
          </div>
          <div className="ca-divider"></div>
          <div className="ca-right">
            <span className="ca-label">COORDINATES</span>
            <span className="ca-text">
              28.5445° N,
              <br />
              77.2710° E
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
