"use client";

import { useSyncExternalStore } from "react";

// Never changes, so the store never notifies — the whole point is the difference
// between the server snapshot and the client one.
const subscribe = () => () => {};

/**
 * True only after hydration. Used where a value simply doesn't exist on the
 * server (a stored theme, a browser API) and rendering it early would cause a
 * hydration mismatch.
 *
 * useSyncExternalStore rather than useState + useEffect: React resolves the
 * server/client difference itself, with no effect that exists only to call
 * setState once (which `react-hooks/set-state-in-effect` rightly flags).
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
