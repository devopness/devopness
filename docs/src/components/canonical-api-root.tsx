"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Keep the API root on the canonical trailing-slash URL.
 *
 * Static hosting is stricter about directory-style routes, and the API
 * selector depends on the canonical `/docs/api/` form. This component fixes
 * the path after hydration when a user lands on `/docs/api`.
 */
export function CanonicalApiRoot() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/docs/api") {
      router.replace("/docs/api/");
    }
  }, [pathname, router]);

  return null;
}
