/** The brand mark: a gradient badge with an "L" + spark glyph — a forge striking
 * off a spark — used in the header, favicon, OG image, and auth/landing screens. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#loreforge-logo-gradient)" />
      <rect x="10" y="7" width="3.4" height="15" rx="1" fill="white" />
      <rect x="10" y="18.8" width="11" height="3.4" rx="1" fill="white" />
      <rect
        x="19"
        y="6"
        width="3.8"
        height="3.8"
        rx="0.9"
        fill="white"
        opacity="0.9"
        transform="rotate(45 20.9 7.9)"
      />
      <defs>
        <linearGradient
          id="loreforge-logo-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#9A3412" />
        </linearGradient>
      </defs>
    </svg>
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
