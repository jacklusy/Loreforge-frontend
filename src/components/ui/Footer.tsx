import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";

/** Social channels shown in the footer. A real deployment swaps these roots for
 * the brand's own handles; they point at the platforms themselves for now so no
 * icon here is a dead link. */
const SOCIAL_LINKS = [
  { href: "https://www.facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://twitter.com", label: "Twitter", Icon: TwitterIcon },
  { href: "https://www.youtube.com", label: "YouTube", Icon: YoutubeIcon },
];

const LINK_GROUPS = [
  {
    heading: "Marketplace",
    links: [
      { href: "/products", label: "Browse items" },
      { href: "/orders", label: "Order history" },
      { href: "/profile", label: "Your account" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stroke bg-background-accent">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A marketplace for digital game items across Jordan and Saudi Arabia — browse,
            buy, and get your receipt in seconds.
          </p>

          <ul className="mt-6 flex gap-2">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-muted-foreground transition-colors hover:border-brand-500/60 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {LINK_GROUPS.map((group) => (
          <div key={group.heading}>
            <h2 className="font-display text-sm font-semibold tracking-wide">{group.heading}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-stroke px-4 py-5">
        <p className="mx-auto max-w-6xl text-center text-xs text-muted-foreground sm:text-left">
          Loreforge — built for the Tamatem technical assessment.
        </p>
      </div>
    </footer>
  );
}
