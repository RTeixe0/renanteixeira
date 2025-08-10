// lib/clarity.ts
// Wrapper seguro p/ Microsoft Clarity carregado via <Script> no layout.
// Sem pacote NPM e sem uso de `any`.

interface ClarityFunction {
  (cmd: "event", name: string, props?: Record<string, unknown>): void;
  (cmd: "set", key: string, value: string | string[]): void;
  (cmd: "consent", consent: boolean): void;
}

declare global {
  interface Window {
    clarity?: ClarityFunction;
  }
}

const getClarity = (): ClarityFunction | null => {
  if (typeof window === "undefined") return null;
  return typeof window.clarity === "function" ? window.clarity : null;
};

export function clarityEvent(
  name: string,
  props?: Record<string, unknown>
): void {
  const c = getClarity();
  if (!c) return;
  try {
    if (props) c("event", name, props);
    else c("event", name);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("[Clarity] event error:", err);
    }
  }
}

export function clarityTag(key: string, value: string | string[]): void {
  const c = getClarity();
  if (!c) return;
  try {
    c("set", key, value);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("[Clarity] set error:", err);
    }
  }
}

export function clarityConsent(consent: boolean): void {
  const c = getClarity();
  if (!c) return;
  try {
    c("consent", consent);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      // console.warn("[Clarity] consent error:", err);
    }
  }
}

export {}; // garante módulo ES
