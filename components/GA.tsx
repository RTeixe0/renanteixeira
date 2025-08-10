// components/GA.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Tipinho local só pra leitura segura (sem conflitar com seu d.ts)
type GtagFn = (...args: unknown[]) => void;
function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  // Usa o que já foi declarado no seu types/gtag.d.ts, mas sem redeclarar aqui
  const g = (window as unknown as { gtag?: GtagFn }).gtag;
  return typeof g === "function" ? g : undefined;
}

export default function GA() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const search = useSearchParams();
  const page = pathname + (search?.toString() ? `?${search}` : "");

  // Envia page_view a cada mudança de rota/query
  useEffect(() => {
    if (!id) return;
    const gtag = getGtag();
    if (!gtag) return;
    gtag("config", id, { page_path: page });
  }, [id, page]);

  // DebugView em dev
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const gtag = getGtag();
      gtag?.("set", "debug_mode", true);
    }
  }, []);

  return null;
}
