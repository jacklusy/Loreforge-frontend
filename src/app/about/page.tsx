import type { Metadata } from "next";
import { Database, Layers, ShieldCheck, TestTube2 } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { SiteHeader } from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Loreforge is built: a FastAPI service, a Next.js storefront, and the decisions behind them.",
};

const PILLARS = [
  {
    icon: Layers,
    title: "Layered by design",
    desc: "Routes call services, services call repositories, repositories call the database. No layer reaches past the one beneath it, so each can be read and tested on its own.",
  },
  {
    icon: ShieldCheck,
    title: "Auth that fails safely",
    desc: "Every endpoint but sign-in requires a bearer token. When one expires, the storefront clears it and explains what happened instead of leaving you on a page that quietly stops working.",
  },
  {
    icon: Database,
    title: "Receipts that stay true",
    desc: "An order snapshots the item's title, price and region at the moment of purchase, so a receipt stays accurate even if the catalog entry changes later.",
  },
  {
    icon: TestTube2,
    title: "Covered by tests",
    desc: "Service logic is unit-tested with mocked repositories; every endpoint is exercised end to end against a real test database.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            About Loreforge
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Loreforge is a compact marketplace for digital game items — a catalog of a hundred
            pieces of gear split across two regional storefronts, with authentication, a
            purchase flow, and a receipt for every order.
          </p>
          <p className="mt-4 text-muted-foreground">
            It exists as a technical assessment build: small enough in scope to finish
            properly, and built the way a production service would be rather than the way a
            demo usually is. The catalog is seeded from a CSV import; the rest is a FastAPI
            service backed by PostgreSQL and a Next.js storefront in TypeScript.
          </p>
        </section>

        <section className="border-t border-stroke bg-background-accent">
          <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-16 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
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

        <section className="mx-auto w-full max-w-3xl px-4 py-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">Under the hood</h2>
          <dl className="mt-6 divide-y divide-stroke rounded-xl border border-stroke bg-surface">
            {[
              ["Backend", "FastAPI · SQLAlchemy 2.0 · PostgreSQL · Alembic · pytest"],
              ["Frontend", "Next.js (App Router) · TypeScript · Tailwind CSS · SWR"],
              ["Auth", "JWT bearer tokens, bcrypt-hashed passwords"],
              ["Packaging", "Docker Compose — database, migrations and CSV import in one command"],
            ].map(([term, detail]) => (
              <div key={term} className="flex flex-col gap-1 p-4 sm:flex-row sm:justify-between">
                <dt className="text-sm font-semibold">{term}</dt>
                <dd className="text-sm text-muted-foreground sm:text-right">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <Footer />
    </div>
  );
}
