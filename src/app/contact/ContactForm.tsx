"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SUPPORT_ADDRESS = "support@loreforge.example";

/**
 * Composes a mailto: rather than posting to an endpoint. There's no mail service
 * behind this build, and a form that silently swallows messages while showing
 * "sent!" would be a lie — this hands the message to the visitor's own mail
 * client, which actually works.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const body = `${message}\n\n— ${name}`;
    const href = `mailto:${SUPPORT_ADDRESS}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Your name
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg border border-stroke bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Subject
        <input
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="rounded-lg border border-stroke bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <textarea
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="resize-y rounded-lg border border-stroke bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      </label>

      <Button type="submit" size="lg" className="self-start">
        <Send className="h-4 w-4" />
        Open in your mail app
      </Button>
    </form>
  );
}
