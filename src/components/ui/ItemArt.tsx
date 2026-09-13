import { getProductVisual } from "@/lib/product-visuals";

interface ItemArtProps {
  title: string;
  className?: string;
  iconClassName?: string;
  /** Larger treatment for the detail page: stronger glow and a double frame. */
  feature?: boolean;
}

/**
 * The art plate behind an item. There's no photography in the source data, so
 * this composes a deterministic scene per item instead — a tinted depth
 * gradient, a radial ember glow, a faint rune grid, and the item's glyph — which
 * keeps every card distinct and intentional rather than reusing one placeholder.
 */
export function ItemArt({ title, className, iconClassName, feature = false }: ItemArtProps) {
  const { icon: Icon, gradient, glow, frame } = getProductVisual(title);

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}
    >
      {/* Ember glow behind the glyph. */}
      <div
        aria-hidden="true"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl ${glow} ${
          feature ? "h-48 w-48" : "h-28 w-28"
        }`}
      />

      {/* Faint rune grid, drawn with a repeating gradient rather than an asset.
          Kept very low contrast and widely spaced so it reads as engraved stone
          rather than graph paper. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,transparent,transparent_27px,white_27px,white_28px),repeating-linear-gradient(90deg,transparent,transparent_27px,white_27px,white_28px)]"
      />

      {/* Vignette, so the plate reads as lit from the middle. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]"
      />

      {/* Inner frame line. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-2 rounded-lg ring-1 ${frame} ${
          feature ? "inset-3 rounded-xl" : ""
        }`}
      />

      <div className="relative flex h-full w-full items-center justify-center">
        <Icon
          className={`text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] ${
            iconClassName ?? (feature ? "h-24 w-24" : "h-12 w-12")
          }`}
        />
      </div>
    </div>
  );
}
