import { createHash } from "crypto";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { consumeRateLimit, getRequestIpHash, isSameOrigin } from "./security";

describe("security helpers", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSalt = process.env.IP_HASH_SALT;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = "production";
    process.env.IP_HASH_SALT = "session-salt";
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalSalt === undefined) {
      delete process.env.IP_HASH_SALT;
      return;
    }

    process.env.IP_HASH_SALT = originalSalt;
  });

  it("accepts same-origin production requests", () => {
    const request = new Request("https://undiamas.net/api/voces", {
      headers: {
        origin: "https://undiamas.net",
        host: "undiamas.net",
      },
    });

    expect(isSameOrigin(request)).toBe(true);
  });

  it("rejects cross-origin production requests", () => {
    const request = new Request("https://undiamas.net/api/voces", {
      headers: {
        origin: "https://otro-sitio.app",
        host: "undiamas.net",
      },
    });

    expect(isSameOrigin(request)).toBe(false);
  });

  it("allows any origin outside production", () => {
    process.env.NODE_ENV = "development";
    const request = new Request("https://undiamas.net/api/voces");

    expect(isSameOrigin(request)).toBe(true);
  });

  it("hashes the first forwarded ip with the configured salt", () => {
    const request = new Request("https://undiamas.net/api/voces", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 203.0.113.11",
      },
    });

    expect(getRequestIpHash(request)).toBe(
      createHash("sha256").update("203.0.113.10:session-salt").digest("hex"),
    );
  });

  it("returns null when the ip hash cannot be computed", () => {
    delete process.env.IP_HASH_SALT;

    expect(getRequestIpHash(new Request("https://undiamas.net/api/voces"))).toBeNull();
  });

  it("returns the outcome of the rate-limit RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    const supabase = { rpc } as never;

    await expect(
      consumeRateLimit(supabase, "voice:test", { maxRequests: 3, windowSeconds: 900 }),
    ).resolves.toBe(true);

    expect(rpc).toHaveBeenCalledWith("consume_rate_limit", {
      limit_key: "voice:test",
      max_requests: 3,
      window_seconds: 900,
    });
  });

  it("throws when the rate-limit RPC fails", async () => {
    const supabase = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } }),
    } as never;

    await expect(
      consumeRateLimit(supabase, "voice:test", { maxRequests: 3, windowSeconds: 900 }),
    ).rejects.toThrow("Unable to consume rate limit.");
  });
});
