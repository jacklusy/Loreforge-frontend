import type { Metadata } from "next";
import { Gamepad2, MapPin, ShieldCheck, Zap } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";
import { HomeCta } from "@/app/HomeCta";

export const metadata: Metadata = {
  title: "Home",
};

const FEATURES = [
  {
    icon: Gamepad2,
    title: "100+ digital items",
    desc: "Swords, potions, gear, and more from your favorite worlds.",
  },
  {
    icon: MapPin,
    title: "JO & SA storefronts",
    desc: "Browse and filter the catalog by the Jordan or Saudi Arabia region.",
  },
  {
    icon: Zap,
    title: "Instant checkout",
    desc: "Buy an item and get your receipt the moment the order is placed.",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,theme(colors.orange.200/0.5),transparent_40%),radial-gradient(circle_at_90%_25%,theme(colors.teal.200/0.4),transparent_40%)] dark:bg-[radial-gradient(circle_at_10%_10%,theme(colors.orange.900/0.3),transparent_40%),radial-gradient(circle_at_90%_25%,theme(colors.teal.900/0.25),transparent_40%)]"
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
          Secure, token-based checkout
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Your favorite game items,
          <span className="text-brand-600"> one click away.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Browse a curated catalog of digital game items across Jordan and Saudi
          Arabia, and check out in seconds.
        </p>

        <div className="mt-8">
          <HomeCta />
        </div>
      </main>

      <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-4 pb-20 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-stroke bg-surface p-5">
            <Icon className="h-5 w-5 text-brand-600" />
            <h2 className="mt-3 text-sm font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
