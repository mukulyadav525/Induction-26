import Link from "next/link";
import LandingSectionCard from "@/components/LandingSectionCard";

const galleryPreviewPhotos = [
  {
    className: "gallery-photo gp-tall",
    src: "photos/gallery/gallery-1.webp",
    fallback: "photos/gallery/images.webp",
    label: "OPENING CEREMONY",
  },
  {
    className: "gallery-photo",
    src: "photos/gallery/gallery-2.webp",
    fallback: "photos/gallery/images.webp",
    label: "RAVI GUPTA",
  },
  {
    className: "gallery-photo",
    src: "photos/gallery/gallery-3.webp",
    fallback: "photos/gallery/images.webp",
    label: "GROUP PHOTO",
  },
  {
    className: "gallery-photo gp-wide",
    src: "photos/gallery/gallery-4.webp",
    fallback: "photos/gallery/images.webp",
    label: "CULTURAL NIGHT",
  },
];

export default function GallerySection() {
  return (
    <LandingSectionCard
      sectionId="gallery"
      sectionClassName="sec-gallery"
      containerClassName="gallery-inner"
      tagText="FILE: GALLERY"
      title="INDUCTION '25 GALLERY"
      titleClassName="gallery-title"
      subtitle="A LOOK BACK AT INDUCTION 2025 — THE YEAR THAT CAME BEFORE YOURS CAPTURED BY TASVEER MEDIA SOCIETY"
      subtitleClassName="gallery-sub"
      headerAction={
        <Link className="gallery-view-all" href="/gallery">
          VIEW FULL ARCHIVE →
        </Link>
      }
    >
      <div className="gallery-grid reveal">
        {galleryPreviewPhotos.map((photo, index) => (
          <div
            key={index}
            className={photo.className}
            style={{
              backgroundImage: `url('${photo.src}'), url('${photo.fallback}')`,
            }}
          >
            <div className="gp-overlay">
              <span className="gp-label">{photo.label}</span>
            </div>
          </div>
        ))}
      </div>
    </LandingSectionCard>
  );
}
