import type { Metadata } from "next";
import { Coins, MapPin, Receipt, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { ItemArt } from "@/components/ui/ItemArt";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { HomeCta } from "@/app/HomeCta";

export const metadata: Metadata = {
  title: "Home",
};

const FEATURES = [
  {
    icon: Coins,
    title: "100+ digital items",
    desc: "Blades, wards, potions and relics, each with a fixed price in the catalog.",
  },
  {
    icon: MapPin,
    title: "Two regional storefronts",
    desc: "Filter the catalog down to the Jordan or Saudi Arabia inventory.",
  },
  {
    icon: Receipt,
    title: "Instant receipts",
    desc: "Every purchase writes an order you can reopen from your history later.",
  },
];

// A representative slice of the catalog, used purely as showcase art on the
// landing page — the real listing is behind auth.
const SHOWCASE = ["Sword of Valor", "Potion of Healing", "Shield of Aegis", "Mystic Wand"];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(249,115,22,0.18),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.14),transparent_50%)]"
          />

          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
                Secure, token-based checkout
              </span>

              <h1 className="mt-6 font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
                Legendary gear,
                <span className="text-brand-600 dark:text-brand-400"> forged to order.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
                Loreforge is a marketplace for digital game items across Jordan and Saudi
                Arabia. Browse the catalog, claim what you need, and walk away with a receipt
                in seconds.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <HomeCta />
                <span className="text-sm text-muted-foreground">No card required to browse.</span>
              </div>
            </div>

            {/* Showcase grid, offset so it reads as a display case rather than a
                second content column. */}
            <div className="grid grid-cols-2 gap-4">
              {SHOWCASE.map((title, index) => (
                <div
                  key={title}
                  className={`overflow-hidden rounded-xl border border-stroke shadow-lg shadow-black/5 dark:shadow-black/40 ${
                    index % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  <ItemArt title={title} className="aspect-square w-full" iconClassName="h-12 w-12" />
                  <p className="truncate bg-surface px-3 py-2.5 font-display text-xs font-semibold">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stroke bg-background-accent">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-stroke bg-surface p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15">
                  <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </span>
                <h2 className="mt-4 font-display text-base font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
