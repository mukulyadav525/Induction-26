import { ArtistRevealVariant } from "@/lib/revealVariants";
import PlasmaFadeOverlay from "./PlasmaFadeOverlay";
import VinylRecordOverlay from "./VinylRecordOverlay";
import DeclassifyOverlay from "./DeclassifyOverlay";
import SpotlightOverlay from "./SpotlightOverlay";

interface ArtistRevealOverlayProps {
  variant: ArtistRevealVariant;
  isRevealed: boolean;
}

export default function ArtistRevealOverlay({
  variant,
  isRevealed,
}: ArtistRevealOverlayProps) {
  switch (variant) {
    case "plasma":
      return <PlasmaFadeOverlay isRevealed={isRevealed} />;
    case "vinyl":
      return <VinylRecordOverlay isRevealed={isRevealed} />;
    case "declassify":
      return <DeclassifyOverlay isRevealed={isRevealed} />;
    case "spotlight":
    default:
      return <SpotlightOverlay isRevealed={isRevealed} />;
  }
}
