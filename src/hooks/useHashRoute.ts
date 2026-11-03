import { useSyncExternalStore } from "react";

/**
 * Returns the current URL hash (e.g. "#team") and re-renders when it changes.
 * This is a lightweight stand-in for a router: link to a page with
 * <a href="#team">, and use the browser back button to go back.
 */
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useHashRoute() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "", // server snapshot (unused in Vite, required by the API)
  );
}
