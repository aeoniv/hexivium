"use client";

import { useEffect } from "react";

/**
 * Listens for Webpack chunk load errors (e.g., transient timeouts or after a hot reload)
 * and forces a safe location refresh with a cache-busting query param.
 */
export default function ChunkErrorReloader() {
  useEffect(() => {
    const isChunkLoadError = (err: unknown, message?: string) => {
      const msg = (message || (err as any)?.message || "").toString();
      return /ChunkLoadError|Loading chunk [^ ]* failed/i.test(msg);
    };

    const reload = () => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("_r", Date.now().toString());
        window.location.replace(url.toString());
      } catch {
        window.location.reload();
      }
    };

    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (isChunkLoadError(e.reason)) reload();
    };
    const onError = (e: ErrorEvent) => {
      if (isChunkLoadError(e.error, e.message)) reload();
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
