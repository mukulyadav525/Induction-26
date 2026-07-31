import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollRevealInit from "@/components/ScrollReveal";
import MouseScaleGallery from "@/components/MouseScaleGallery";

const galleryNavLinks = [
  { label: "HOME", href: "/" },
  // { label: "BUDDY", href: "/induction-buddies" },
  { label: "CONTACT", href: "/contact" },
];

const allGalleryPhotos = [
  { src: "/photos/gallery/gallery-7.webp", label: "INDUCTION NIGHT" },
  {
    src: "/photos/gallery/gallery-2.webp",
    label: "RAVI GUPTA",
    focalPosition: "center 18%",
  },
  { src: "/photos/gallery/gallery-3.webp", label: "BATCH PHOTOGRAPHS" },
  { src: "/photos/gallery/gallery-4.webp", label: "SUFI NIGHT" },
  { src: "/photos/gallery/gallery-5.webp", label: "MENTOR CONNECT" },
  { src: "/photos/gallery/gallery-6.webp", label: "CLUB FAIR" },
  { src: "/photos/gallery/gallery-1.webp", label: "OPENING CEREMONY" },
  { src: "/photos/gallery/gallery-8.webp", label: "CULTURAL NIGHT" },
  { src: "/photos/gallery/gallery-9.webp", label: "DESI ADDA" },
  { src: "/photos/gallery/gallery-10.webp", label: "KEYNOTE SESSION" },
  { src: "/photos/gallery/gallery-11.webp", label: "SELF DEFENCE SESSION" },
  { src: "/photos/gallery/gallery-12.webp", label: "TALENT NIGHT" },
];

export default function GalleryPage() {
  return (
    <>
      <Navbar isScrolledByDefault={true} links={galleryNavLinks} />

      <PageHero
        title={
          <>
            INDUCTION &apos;25
            <br />
            GALLERY
          </>
        }
        subtitles={[
          "MOUSE-SCALED ARCHIVE ROWS · MOVE ACROSS EACH PAIR TO REBALANCE THE FRAME",
          "CAPTURED BY TASVEER, THE MEDIA SOCIETY",
        ]}
      />

      <section className="sec-gallery sched-page-body" id="gallery-archive">
        <div className="container">
          <MouseScaleGallery photos={allGalleryPhotos} />
        </div>
      </section>

      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2030",
          "IIIT DELHI",
          "FILE / ARCHIVE PHOTOGRAPHS",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-2028 · FILE / ARCHIVE PHOTOGRAPHS · CONFIDENTIAL WHEN PRINTED"
      />
      <ScrollRevealInit />
    </>
  );
}
