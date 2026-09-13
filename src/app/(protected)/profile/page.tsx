"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { getMyProfile } from "@/lib/api/me";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import type { UserProfile } from "@/types/user";
import { ActivityFeed } from "@/app/(protected)/profile/ActivityFeed";
import { ChangePasswordForm } from "@/app/(protected)/profile/ChangePasswordForm";

export default function ProfilePage() {
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const { data: profile, error: profileError } = useSWR<UserProfile, ApiError>(
    token ? ["me", token] : null,
    () => getMyProfile(token as string)
  );

  useEffect(() => {
    document.title = "Profile · Loreforge";
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account and password.</p>

      <section className="mt-8 rounded-2xl border border-stroke bg-surface p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">Account</h2>
        {profileError ? (
          <Alert variant="error" className="mt-3">
            Failed to load your account info.
          </Alert>
        ) : !profile ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <dl className="mt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <ChangePasswordForm />
      <ActivityFeed />
    </main>
  );
}
