import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseAdminClient } = vi.hoisted(() => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient,
}));

import { POST } from "./route";

describe("POST /api/voces/[id]/yo-tambien", () => {
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

  it("registers a private accompaniment reaction", async () => {
    const rpc = vi.fn((fnName: string) => {
      if (fnName === "consume_rate_limit") {
        return Promise.resolve({ data: true, error: null });
      }

      if (fnName === "registrar_yo_tambien") {
        return Promise.resolve({ data: 4, error: null });
      }

      return Promise.resolve({ data: null, error: null });
    });

    createSupabaseAdminClient.mockReturnValue({ rpc });

    const response = await POST(
      new Request("https://undiamas.net/api/voces/3fa85f64-5717-4562-b3fc-2c963f66afa6/yo-tambien", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      { params: Promise.resolve({ id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 4 });
    expect(rpc).toHaveBeenNthCalledWith(2, "registrar_yo_tambien", {
      voz_uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      actor_hash: expect.any(String),
    });
  });

  it("rejects invalid voice ids", async () => {
    createSupabaseAdminClient.mockReturnValue({});

    const response = await POST(
      new Request("https://undiamas.net/api/voces/not-a-uuid/yo-tambien", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      { params: Promise.resolve({ id: "not-a-uuid" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Voz inválida." });
  });

  it("returns 429 when the reaction rate limit is exceeded", async () => {
    createSupabaseAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
    });

    const response = await POST(
      new Request("https://undiamas.net/api/voces/3fa85f64-5717-4562-b3fc-2c963f66afa6/yo-tambien", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      { params: Promise.resolve({ id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) },
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("300");
  });

  it("accepts x-real-ip as a fallback source", async () => {
    const rpc = vi.fn((fnName: string) => {
      if (fnName === "consume_rate_limit") {
        return Promise.resolve({ data: true, error: null });
      }

      if (fnName === "registrar_yo_tambien") {
        return Promise.resolve({ data: 2, error: null });
      }

      return Promise.resolve({ data: null, error: null });
    });

    createSupabaseAdminClient.mockReturnValue({ rpc });

    const response = await POST(
      new Request("https://undiamas.net/api/voces/3fa85f64-5717-4562-b3fc-2c963f66afa6/yo-tambien", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-real-ip": "203.0.113.10",
        },
      }),
      { params: Promise.resolve({ id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 2 });
  });

  it("still registers a reaction when the rate-limit backend is unavailable", async () => {
    createSupabaseAdminClient.mockReturnValue({
      rpc: vi.fn((fnName: string) => {
        if (fnName === "consume_rate_limit") {
          return Promise.resolve({ data: null, error: { message: "missing function" } });
        }

        if (fnName === "registrar_yo_tambien") {
          return Promise.resolve({ data: 5, error: null });
        }

        return Promise.resolve({ data: null, error: null });
      }),
    });

    const response = await POST(
      new Request("https://undiamas.net/api/voces/3fa85f64-5717-4562-b3fc-2c963f66afa6/yo-tambien", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      { params: Promise.resolve({ id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 5 });
  });
});
