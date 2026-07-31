import LandingSectionCard from "@/components/LandingSectionCard";

const campusPhotos = [
  {
    className: "campus-photo cp-tall",
    src: "photos/campus/academic-block.webp",
    fallback: "photos/campus/academic.webp",
    label: "ACADEMIC BLOCK",
  },
  {
    className: "campus-photo",
    src: "photos/campus/auditorium.webp",
    fallback: "photos/campus/oat.webp",
    label: "AUDITORIUM & LIBRARY",
  },
  {
    className: "campus-photo",
    src: "photos/campus/library.webp",
    fallback: "photos/campus/lhc.webp",
    label: "LHC",
  },
  {
    className: "campus-photo cp-wide",
    src: "photos/campus/sports-complex.webp",
    fallback: "photos/campus/rnd.webp",
    label: "RESEARCH AND DEVELOPMENT BUILDING",
  },
];

export default function CampusSection() {
  return (
    <LandingSectionCard
      sectionId="campus"
      sectionClassName="sec-campus"
      tagText="FILE: CAMPUS"
      title="IIIT DELHI CAMPUS"
      titleClassName="sec-heading sec-heading--light"
      subtitle="A compact, vibrant campus in South Delhi — everything within walking distance, everyone within reach."
      subtitleClassName="campus-sub"
    >
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
    </LandingSectionCard>
  );
}
