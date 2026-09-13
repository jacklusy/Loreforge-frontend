import Image from "next/image";

/** The brand mark: a gradient badge with an "L" + spark glyph — a forge striking
 * off a spark — rendered from a real PNG asset (public/logo-mark.png) so it's a
 * genuine image file, not an inline icon, reused for the favicon and apple-touch
 * icon too (see app/icon.png and app/apple-icon.png). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={512}
      height={512}
      priority
      className={className}
    />
  );
}

/** Full lockup: mark + wordmark, used in the header and on auth/landing screens. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-foreground">Loreforge</span>
        <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Game Marketplace
        </span>
      </span>
    </span>
  );
}
