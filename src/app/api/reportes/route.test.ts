import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseAdminClient } = vi.hoisted(() => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient,
}));

import { POST } from "./route";

describe("POST /api/reportes", () => {
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

  it("stores a valid report", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });

    createSupabaseAdminClient.mockReturnValue({ from, rpc });

    const response = await POST(
      new Request("https://undiamas.net/api/reportes", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          vozId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          motivo: "Puede vulnerar las reglas de convivencia.",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(from).toHaveBeenCalledWith("reportes");
    expect(insert).toHaveBeenCalledWith({
      voz_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      motivo: "Puede vulnerar las reglas de convivencia.",
      ip_hash: expect.any(String),
    });
  });

  it("rejects invalid report payloads", async () => {
    createSupabaseAdminClient.mockReturnValue({});

    const response = await POST(
      new Request("https://undiamas.net/api/reportes", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          vozId: "not-a-uuid",
          motivo: "x",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Reporte inválido." });
  });

  it("returns 503 when the service role client is unavailable", async () => {
    createSupabaseAdminClient.mockReturnValue(null);

    const response = await POST(
      new Request("https://undiamas.net/api/reportes", {
        method: "POST",
        headers: {
          origin: "https://undiamas.net",
          host: "undiamas.net",
          "x-forwarded-for": "203.0.113.10",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          vozId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          motivo: "Puede vulnerar las reglas de convivencia.",
        }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "El servicio no está configurado.",
    });
  });
});
