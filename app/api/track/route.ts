// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Payload = {
  event_type: string; // "page_view" | "click" | "time_spent" | ...
  page?: string;
  referrer?: string;
  element?: string;
  duration_ms?: number;
  session_id?: string;
  utm?: Record<string, string>;
  extra?: Record<string, unknown>;
};

type GeoResponse = {
  city?: string;
  region?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
};

function isLikelyBot(ua: string) {
  const bots =
    /(bot|spider|crawler|preview|facebookexternalhit|headless|pingdom|monitoring|uptime)/i;
  return bots.test(ua);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;

    if (!body?.event_type) {
      return NextResponse.json(
        { ok: false, error: "missing event_type" },
        { status: 400 }
      );
    }

    const ua = req.headers.get("user-agent") || "";
    if (isLikelyBot(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    // IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    // Geolocalização (evita localhost)
    let city: string | undefined;
    let region: string | undefined;
    let country: string | undefined;
    let lat: number | undefined;
    let lon: number | undefined;

    try {
      if (ip && !ip.startsWith("127.") && ip !== "::1") {
        const r = await fetch(`https://ipapi.co/${ip}/json/`, {
          cache: "no-store",
        });
        if (r.ok) {
          const g = (await r.json()) as GeoResponse;
          city = g.city;
          region = g.region;
          country = g.country_name;
          lat = g.latitude;
          lon = g.longitude;
        }
      }
    } catch {
      // ignora falha de geo
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
      { auth: { persistSession: false } }
    );

    await supabase.from("events").insert({
      event_type: body.event_type,
      page: body.page,
      referrer: body.referrer,
      element: body.element,
      duration_ms: body.duration_ms ?? null,
      session_id: body.session_id ?? null,
      utm: body.utm ?? null,
      extra: body.extra ?? null,
      ip: ip || null,
      ua,
      city,
      region,
      country,
      lat,
      lon,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    // narrowing elegante sem any
    let msg = "unknown error";
    if (e instanceof Error) msg = e.message;
    else if (typeof e === "string") msg = e;
    else {
      try {
        msg = JSON.stringify(e);
      } catch {
        /* noop */
      }
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
