interface BrandIconProps {
  className?: string;
}

/**
 * Social brand marks.
 *
 * lucide-react removed its brand icons, so these are drawn here in the same
 * stroke style (24px box, 2px round strokes) as every other icon in the app —
 * otherwise the footer row would mix filled logos with outlined UI glyphs.
 */
function BrandIcon({ className, children }: BrandIconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function FacebookIcon({ className }: BrandIconProps) {
  return (
    <BrandIcon className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </BrandIcon>
  );
}

export function InstagramIcon({ className }: BrandIconProps) {
  return (
    <BrandIcon className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </BrandIcon>
  );
}

export function TwitterIcon({ className }: BrandIconProps) {
  return (
    <BrandIcon className={className}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </BrandIcon>
  );
}

export function YoutubeIcon({ className }: BrandIconProps) {
  return (
    <BrandIcon className={className}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z" />
    </BrandIcon>
  );
}
