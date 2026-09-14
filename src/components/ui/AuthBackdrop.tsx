import { FlaskConical, Shield, Sparkles, Sword } from "lucide-react";

/** Item glyphs drifting behind the card, as in the design. Positions are hand
 * placed rather than random so the composition is the same on every load and
 * nothing lands under the form. */
const FLOATING_ITEMS = [
  { Icon: Sword, className: "top-[12%] left-[8%] h-40 w-40 -rotate-12" },
  { Icon: Shield, className: "top-[58%] left-[14%] h-32 w-32 rotate-6" },
  { Icon: FlaskConical, className: "top-[18%] right-[10%] h-28 w-28 rotate-12" },
  { Icon: Sparkles, className: "bottom-[14%] right-[12%] h-36 w-36 -rotate-6" },
];

/**
 * The lit, out-of-focus scene behind the sign-in card: a couple of coloured
 * washes, drifting item glyphs blurred back into the depth of field, and a
 * vignette. Drawn rather than photographed so it costs no asset and follows the
 * active theme instead of forcing the page dark.
 */
export function AuthBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,var(--color-brand-500),transparent_45%),radial-gradient(circle_at_82%_72%,var(--color-accent-500),transparent_45%)] opacity-20 dark:opacity-30" />

      {FLOATING_ITEMS.map(({ Icon, className }, index) => (
        <Icon
          key={index}
          className={`absolute text-foreground opacity-[0.07] blur-[2px] dark:opacity-[0.09] ${className}`}
        />
      ))}

      {/* Out-of-focus embers. */}
      <div className="absolute top-[30%] left-[30%] h-24 w-24 rounded-full bg-brand-400/20 blur-2xl" />
      <div className="absolute top-[65%] right-[28%] h-32 w-32 rounded-full bg-accent-400/15 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)] opacity-80" />
    </div>
  );
}
