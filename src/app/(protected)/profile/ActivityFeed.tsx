"use client";

import useSWR from "swr";
import { KeyRound, LogIn, ShieldAlert, ShoppingBag, UserRound } from "lucide-react";
import { getMyActivity } from "@/lib/api/me";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ActivityEntry } from "@/types/user";

const EVENT_META: Record<string, { label: string; icon: typeof LogIn }> = {
  login_success: { label: "Signed in", icon: LogIn },
  login_failed: { label: "Failed sign-in attempt", icon: ShieldAlert },
  product_purchased: { label: "Made a purchase", icon: ShoppingBag },
  password_changed: { label: "Changed password", icon: KeyRound },
};

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const meta = EVENT_META[entry.event_type] ?? { label: entry.event_type, icon: UserRound };
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{meta.label}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(entry.created_at).toLocaleString()}
          {entry.ip_address && ` · ${entry.ip_address}`}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const { token } = useAuth();
  const { data: activity } = useSWR<ActivityEntry[], ApiError>(
    token ? ["me-activity", token] : null,
    () => getMyActivity(token as string)
  );

  return (
    <section className="mt-6 rounded-2xl border border-stroke bg-surface p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">Recent activity</h2>
      {!activity ? (
        <div className="mt-3 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : activity.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="mt-1 divide-y divide-stroke">
          {activity.map((entry) => (
            <ActivityRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
