import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ContactForm } from "@/app/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Loreforge team about orders, items, or your account.",
};

const CHANNELS = [
  { icon: Mail, label: "Email", value: "support@loreforge.example" },
  { icon: Clock, label: "Hours", value: "Sun–Thu, 9:00–17:00 (GMT+3)" },
  { icon: MapPin, label: "Regions served", value: "Jordan and Saudi Arabia" },
];

const FAQS = [
  {
    question: "Where do I find a past receipt?",
    answer:
      "Every purchase is kept under Orders in your account. Opening an order reopens its full receipt, including what you paid and when.",
  },
  {
    question: "Why was I signed out?",
    answer:
      "Sessions last an hour. When yours expires the storefront signs you out and says so, rather than leaving you on a page whose requests quietly fail.",
  },
  {
    question: "Can I buy more than one item at once?",
    answer:
      "Not currently — each purchase covers a single item, and each produces its own order and receipt.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-20">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Questions about an order, an item, or your account — send them over and we&rsquo;ll
            get back to you.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
            <ContactForm />

            <aside className="space-y-6">
              <div className="rounded-xl border border-stroke bg-surface p-6">
                <h2 className="font-display text-base font-semibold">Reach us directly</h2>
                <ul className="mt-4 space-y-4">
                  {CHANNELS.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-stroke bg-background-accent">
          <div className="mx-auto w-full max-w-3xl px-4 py-16">
            <h2 className="font-display text-2xl font-bold tracking-tight">Common questions</h2>
            <div className="mt-6 divide-y divide-stroke rounded-xl border border-stroke bg-surface">
              {FAQS.map(({ question, answer }) => (
                <details key={question} className="group p-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {question}
                      <span className="text-muted-foreground transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
