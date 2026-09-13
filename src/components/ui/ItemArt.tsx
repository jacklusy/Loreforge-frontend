import Image from "next/image";
import { getItemImage } from "@/lib/item-images";
import { getProductVisual } from "@/lib/product-visuals";

interface ItemArtProps {
  title: string;
  className?: string;
  iconClassName?: string;
  /** Larger treatment for the detail page: stronger glow and a double frame. */
  feature?: boolean;
  /** Passed to next/image when the item has real artwork. */
  sizes?: string;
}

/**
 * The art plate behind an item.
 *
 * When `public/items/<slug>.jpg` exists (see `lib/item-images`) that painting is
 * used. Otherwise this composes a deterministic scene per item — a lit stone
 * alcove with the item's glyph on a plinth — so every card still reads as
 * intentional artwork rather than one shared placeholder.
 */
export function ItemArt({
  title,
  className,
  iconClassName,
  feature = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ItemArtProps) {
  const { icon: Icon, gradient, glow, frame } = getProductVisual(title);
  const painting = getItemImage(title);

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}
    >
      {painting ? (
        <Image src={painting} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          {/* Rough stone courses behind the item — wide, low-contrast bands, not
              a grid, so it reads as a wall rather than graph paper. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,transparent,transparent_38px,white_38px,white_39px),repeating-linear-gradient(90deg,transparent,transparent_62px,white_62px,white_63px)]"
          />

          {/* Ember glow, offset low so the light appears to come from a forge
              at floor level the way it does in the reference art. */}
          <div
            aria-hidden="true"
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl ${glow} ${
              feature ? "h-56 w-72" : "h-32 w-40"
            }`}
          />

          {/* Oversized ghost of the glyph, for depth behind the crisp one. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon
              className={`text-white opacity-[0.055] blur-[1px] ${feature ? "h-72 w-72" : "h-40 w-40"}`}
            />
          </div>

          {/* Pool of light on the ground the item stands in. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[15%] bottom-[8%] h-[14%] rounded-[50%] bg-white/15 blur-xl"
          />

          <div className="relative flex h-full w-full items-center justify-center">
            <Icon
              className={`text-white/90 drop-shadow-[0_6px_16px_rgba(0,0,0,0.75)] ${
                iconClassName ?? (feature ? "h-28 w-28" : "h-14 w-14")
              }`}
            />
          </div>
        </>
      )}

      {/* Vignette and frame sit above either treatment, so a dropped-in painting
          picks up the same lighting and border as the generated plates. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]"
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-lg ring-1 ${frame} ${
          feature ? "inset-3 rounded-xl" : "inset-2"
        }`}
      />
    </div>
  );
}
