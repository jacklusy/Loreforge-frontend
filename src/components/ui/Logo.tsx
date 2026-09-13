/** The brand mark: a gradient badge with a "T" glyph, used in the header, the
 * favicon-adjacent OG image, and the login/landing screens. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#tamatem-logo-gradient)" />
      <path d="M9 11.5h14M16 11.5v10" stroke="white" strokeWidth="2.75" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="tamatem-logo-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#4C1D95" />
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
        <span className="text-[15px] font-bold tracking-tight text-foreground">Tamatem</span>
        <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Game Store
        </span>
      </span>
    </span>
  );
}
