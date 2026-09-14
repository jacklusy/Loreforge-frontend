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
          {/* The gradient is a colour cast, not the subject: knocked back so the
              plate stays as dark and moody as the reference art. */}
          <div aria-hidden="true" className="absolute inset-0 bg-stone-950/45" />

          {/* Light falling from above onto the back wall of the niche. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.12),transparent_70%)]"
          />

          {/* Ember glow, low, so the item reads as lit by a forge at floor level
              the way it is in the reference art. */}
          <div
            aria-hidden="true"
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl ${glow} ${
              feature ? "h-56 w-72" : "h-32 w-40"
            }`}
          />

          {/* Pool of light the item stands in. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[18%] bottom-[9%] h-[12%] rounded-[50%] bg-white/12 blur-xl"
          />

          <div className="relative flex h-full w-full items-center justify-center">
            <Icon
              className={`text-white/95 drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] ${
                iconClassName ?? (feature ? "h-28 w-28" : "h-14 w-14")
              }`}
            />
          </div>
        </>
      )}

      {/* Vignette sits above either treatment, so a dropped-in painting picks up
          the same lighting as the generated plates. The inner frame line is kept
          for the feature panel only — on a card it would draw a hard rectangle
          across artwork that is meant to bleed into the text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]"
      />
      {feature && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-3 rounded-xl ring-1 ${frame}`}
        />
      )}
    </div>
  );
}
