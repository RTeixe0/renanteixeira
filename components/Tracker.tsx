// components/Tracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { usePathname, useSearchParams } from "next/navigation";

// Gera ou recupera ID de sessão persistente
function getSessionId() {
  const KEY = "rt_session_id";
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = uuid();
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

// Extrai parâmetros UTM da URL
function utmFromURL(searchParams: string) {
  if (!searchParams) return undefined;
  const params = new URLSearchParams(searchParams);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const obj: Record<string, string> = {};
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) obj[k] = v;
  });
  return Object.keys(obj).length ? obj : undefined;
}

// Envia evento pro backend
async function send(event: Record<string, unknown>) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(event),
    });
  } catch {
    // ignora erros
  }
}

export default function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams?.toString() || ""; // versão estável da query string
  const startRef = useRef<number>(Date.now());
  const sessionRef = useRef<string>("");

  useEffect(() => {
    sessionRef.current = getSessionId();

    // page_view inicial
    send({
      event_type: "page_view",
      page: pathname + (searchString ? `?${searchString}` : ""),
      referrer: document.referrer || undefined,
      session_id: sessionRef.current,
      utm: utmFromURL(searchString),
    });

    // contabiliza tempo
    const onBeforeUnload = () => {
      const duration = Date.now() - startRef.current;
      send({
        event_type: "time_spent",
        page: pathname + (searchString ? `?${searchString}` : ""),
        duration_ms: duration,
        session_id: sessionRef.current,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onBeforeUnload();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibility);

    // clique genérico
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a,button,[data-track]");
      if (!t) return;
      const el = t as HTMLElement;
      const text =
        el.getAttribute("data-track") ||
        (el.textContent || "").trim().slice(0, 80) ||
        (el as HTMLAnchorElement).getAttribute?.("href") ||
        el.tagName;

      send({
        event_type: "click",
        page: pathname + (searchString ? `?${searchString}` : ""),
        element: text,
        session_id: sessionRef.current,
      });
    };

    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick);
    };
  }, [pathname, searchString]); // agora ESLint para de reclamar

  // Novo page_view a cada mudança de rota/query
  useEffect(() => {
    startRef.current = Date.now();
    send({
      event_type: "page_view",
      page: pathname + (searchString ? `?${searchString}` : ""),
      referrer: document.referrer || undefined,
      session_id: sessionRef.current,
      utm: utmFromURL(searchString),
    });
  }, [pathname, searchString]);

  return null;
}
