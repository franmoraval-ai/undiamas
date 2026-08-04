import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

type RateLimit = {
  maxRequests: number;
  windowSeconds: number;
};

export const rateLimits = {
  voice: { maxRequests: 3, windowSeconds: 900 },
  report: { maxRequests: 6, windowSeconds: 900 },
  reaction: { maxRequests: 30, windowSeconds: 300 },
} satisfies Record<string, RateLimit>;

export function isSameOrigin(request: Request) {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return Boolean(origin && host && new URL(origin).host === host);
}

export function getRequestIpHash(request: Request) {
  const salt = process.env.IP_HASH_SALT;
  const ip =
    request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip");

  if (!salt || !ip) return null;
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export async function consumeRateLimit(
  supabase: SupabaseClient,
  key: string,
  { maxRequests, windowSeconds }: RateLimit,
) {
  const { data, error } = await supabase.rpc("consume_rate_limit", {
    limit_key: key,
    max_requests: maxRequests,
    window_seconds: windowSeconds,
  });

  if (error) throw new Error("Unable to consume rate limit.");
  return data === true;
}