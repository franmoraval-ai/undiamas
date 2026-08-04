import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseAdminClient } = vi.hoisted(() => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient,
}));

import { POST } from "./route";

describe("POST /api/voces", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSalt = process.env.IP_HASH_SALT;

  beforeEach(() => {
    vi.clearAllMocks();
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

  it("stores a new voice in pending moderation", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });

    createSupabaseAdminClient.mockReturnValue({ from, rpc });

    const response = await POST(
      new Request("https://undiamas.net/api/voces", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          texto: "Necesitaba dejar estas palabras en un sitio tranquilo y seguro.",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(rpc).toHaveBeenCalledWith("consume_rate_limit", {
      limit_key: expect.stringMatching(/^voice:/),
      max_requests: 3,
      window_seconds: 900,
    });
    expect(from).toHaveBeenCalledWith("voces");
    expect(insert).toHaveBeenCalledWith({
      texto: "Necesitaba dejar estas palabras en un sitio tranquilo y seguro.",
      estado: "pendiente",
      ip_hash: expect.any(String),
    });
  });

  it("rejects invalid payloads", async () => {
    createSupabaseAdminClient.mockReturnValue({});

    const response = await POST(
      new Request("https://undiamas.net/api/voces", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({ texto: "Muy poco" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "El texto debe tener entre 24 y 2800 caracteres.",
    });
  });

  it("returns 429 when the voice rate limit is exceeded", async () => {
    createSupabaseAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
      from: vi.fn(),
    });

    const response = await POST(
      new Request("https://undiamas.net/api/voces", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          texto: "Necesitaba dejar estas palabras en un sitio tranquilo y seguro.",
        }),
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("900");
  });
});
