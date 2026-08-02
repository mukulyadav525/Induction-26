export default function HeroCanvasSeam() {
  return (
    <div className="hero-canvas-seam">
      <svg
        className="hero-canvas-seam-tear"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,90 L0,38 L52,58 L104,20 L158,50 L214,12 L268,46 L322,18 L378,52 L432,16 L488,44 L544,10 L600,48 L656,20 L712,54 L768,14 L824,46 L880,18 L936,50 L992,12 L1048,46 L1104,20 L1160,52 L1216,16 L1272,48 L1328,14 L1384,44 L1440,20 L1440,90 Z" />
      </svg>
      <img
        src="/assets/stack-deco/washi-tape.svg"
        alt=""
        className="hero-canvas-seam-tape hero-canvas-seam-tape--left"
      />
      <img
        src="/assets/stack-deco/washi-tape.svg"
        alt=""
        className="hero-canvas-seam-tape hero-canvas-seam-tape--right"
      />
    </div>
  );
}
