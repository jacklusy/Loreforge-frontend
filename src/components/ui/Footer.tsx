import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

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
