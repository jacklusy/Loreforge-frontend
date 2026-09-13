import { apiFetch } from "@/lib/api/client";
import type { ActivityEntry, UserProfile } from "@/types/user";

export function getMyProfile(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/me", { token });
}

export function changePassword(
  token: string,
  payload: { current_password: string; new_password: string }
): Promise<void> {
  return apiFetch<void>("/me/password", { method: "PUT", body: payload, token });
}

export function getMyActivity(token: string): Promise<ActivityEntry[]> {
  return apiFetch<ActivityEntry[]>("/me/activity", { token });
}
