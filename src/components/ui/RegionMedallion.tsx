import type { Location } from "@/types/product";

const REGION_NAMES: Record<Location, string> = {
  JO: "Jordan",
  SA: "Saudi Arabia",
};

interface RegionMedallionProps {
  location: Location;
  className?: string;
}

/**
 * The region a listing belongs to, struck as a small coin. Purely decorative
 * styling over a real label — the accessible name spells the country out, since
 * "JO" on its own means nothing read aloud.
 */
export function RegionMedallion({ location, className }: RegionMedallionProps) {
  return (
    <span
      title={REGION_NAMES[location]}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-stroke-strong to-surface-muted font-mono text-[10px] font-bold text-muted-foreground shadow-inner ring-1 ring-stroke-strong ring-offset-1 ring-offset-surface ${
        className ?? ""
      }`}
    >
      <span aria-hidden="true">{location}</span>
      <span className="sr-only">{REGION_NAMES[location]}</span>
    </span>
  );
}
