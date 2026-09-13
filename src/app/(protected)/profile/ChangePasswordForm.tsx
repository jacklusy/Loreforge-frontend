"use client";

import { useState, type FormEvent } from "react";
import { changePassword } from "@/lib/api/me";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (newPassword !== confirmPassword) {
      setFormError("New password and confirmation don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(token as string, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setFormSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-stroke bg-surface p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">Change password</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Current password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-lg border border-stroke bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          New password
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-lg border border-stroke bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Confirm new password
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-stroke bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </label>

        {formError && <Alert variant="error">{formError}</Alert>}
        {formSuccess && <Alert variant="success">Password updated.</Alert>}

        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? "Saving…" : "Update password"}
        </Button>
      </form>
    </section>
  );
}
