export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

type Gtag = {
  (command: "event", action: string, params?: Record<string, unknown>): void;
  (command: "config", id: string, params?: Record<string, unknown>): void;
  (command: "set", key: string, value?: unknown): void;
};

// Acessa window.gtag sem redeclarar global (evita conflito com seu types/gtag.d.ts)
function getGtag(): Gtag | undefined {
  if (typeof window === "undefined") return undefined;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === "function" ? g : undefined;
}

// Pageview manual (usado pelo GA.tsx nas trocas de rota)
export function pageview(url: string): void {
  const id = GA_TRACKING_ID;
  const gtag = getGtag();
  if (!id || !gtag) return;
  gtag("config", id, { page_path: url });
}

// Evento customizado
export type GAEventParams = {
  action: string; // ex.: 'cta_click', 'outbound_click'
  category?: string; // ex.: 'Hero', 'Projetos', 'Contato'
  label?: string; // ex.: 'Ver projetos', 'GitHub', 'Site | Projeto X'
  value?: string | number; // ex.: 1
};

export function gtagEvent({
  action,
  category,
  label,
  value,
}: GAEventParams): void {
  const id = GA_TRACKING_ID;
  const gtag = getGtag();
  if (!id || !gtag) return;

  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    send_to: id, // garante envio para o stream correto
    transport_type: "beacon",
  });
}

// (Opcional) Liga DebugView em dev
export function enableGADebug(): void {
  const gtag = getGtag();
  if (gtag && process.env.NODE_ENV !== "production") {
    gtag("set", "debug_mode", true);
  }
}
