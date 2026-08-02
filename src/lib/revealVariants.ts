export type ArtistRevealVariant = "plasma" | "vinyl" | "declassify" | "spotlight";

export const ARTIST_REVEAL_VARIANTS: { value: ArtistRevealVariant; label: string }[] = [
  { value: "spotlight", label: "Spotlight sweep" },
  { value: "plasma", label: "Plasma fade" },
  { value: "vinyl", label: "Vinyl record" },
  { value: "declassify", label: "Declassify stamp" },
];

export const DEFAULT_ARTIST_REVEAL_VARIANT: ArtistRevealVariant = "spotlight";
