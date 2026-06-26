import Link from "next/link";

const galleryPreviewPhotos = [
  {
    className: "gallery-photo gp-tall",
    src: "photos/gallery/gallery-1.jpg",
    fallback: "photos/gallery/images.png",
    label: "OPENING CEREMONY",
  },
  {
    className: "gallery-photo",
    src: "photos/gallery/gallery-2.jpg",
    fallback: "photos/gallery/images.png",
    label: "RAVI GUPTA",
  },
  {
    className: "gallery-photo",
    src: "photos/gallery/gallery-3.jpg",
    fallback: "photos/gallery/images.png",
    label: "GROUP PHOTO",
  },
  {
    className: "gallery-photo gp-wide",
    src: "photos/gallery/gallery-4.jpg",
    fallback: "photos/gallery/images.png",
    label: "CULTURAL NIGHT",
  },
  {
    className: "gallery-photo gp-wide2",
    src: "photos/gallery/gallery-7.jpg",
    fallback: "photos/gallery/images.png",
    label: "INDUCTION NIGHT",
  },
];

export default function GallerySection() {
  return (
    <section className="sec-gallery" id="gallery">
      <div className="gallery-inner">
        <div className="gallery-hdr reveal">
          <div className="gallery-hdr-left">
            <h2 className="gallery-title">
              INDUCTION
              <br />
              &apos;25 GALLERY
            </h2>
            <p className="gallery-sub">
              A LOOK BACK AT INDUCTION 2025 — THE YEAR THAT CAME BEFORE YOURS
              CAPTURED BY TASVEER MEDIA SOCIETY
            </p>
          </div>
          <Link className="gallery-view-all" href="/gallery">
            VIEW FULL ARCHIVE →
          </Link>
        </div>

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
      </div>
    </section>
  );
}
