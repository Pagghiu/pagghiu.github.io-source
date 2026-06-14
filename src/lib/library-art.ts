export type LibraryArtVariant = "signal" | "lattice" | "pulse";

export function getLibraryArtSeed(slug: string) {
  return slug.split("").reduce((value, char) => value + char.charCodeAt(0), 0);
}

export function getLibraryAccent(seed: number) {
  const palette = [
    ["#690089", "#0008ff", "#78daff"],
    ["#5c0db5", "#1b58ff", "#7fe6ff"],
    ["#690089", "#4d1aff", "#9ef3ff"]
  ] as const;
  return palette[seed % palette.length];
}

export function getVariantTitle(variant: LibraryArtVariant) {
  const titles = {
    signal: "Signal frame",
    lattice: "Gradient lattice",
    pulse: "Pulse mesh"
  };
  return titles[variant];
}

