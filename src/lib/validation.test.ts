import { describe, expect, it } from "vitest";
import { createReportSchema, createVoiceSchema, voiceIdSchema } from "./validation";

describe("public mutation validation", () => {
  it("accepts and trims a voice within the allowed length", () => {
    const result = createVoiceSchema.safeParse({ texto: "   Necesitaba decir esto en algún lugar seguro.   " });

    expect(result.success).toBe(true);
    expect(result.data?.texto).toBe("Necesitaba decir esto en algún lugar seguro.");
  });

  it("rejects a voice that is too short", () => {
    expect(createVoiceSchema.safeParse({ texto: "Muy poco" }).success).toBe(false);
  });

  it("rejects a voice that exceeds the maximum length", () => {
    expect(createVoiceSchema.safeParse({ texto: "a".repeat(2801) }).success).toBe(false);
  });

  it("requires a UUID and trims a meaningful reason for reports", () => {
    const result = createReportSchema.safeParse({
      vozId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      motivo: "  Esto vulnera las reglas  ",
    });

    expect(result.success).toBe(true);
    expect(result.data?.motivo).toBe("Esto vulnera las reglas");
    expect(createReportSchema.safeParse({ vozId: "not-a-uuid", motivo: "x" }).success).toBe(false);
  });

  it("requires a valid voice id in routes", () => {
    expect(voiceIdSchema.safeParse("3fa85f64-5717-4562-b3fc-2c963f66afa6").success).toBe(true);
    expect(voiceIdSchema.safeParse("not-a-uuid").success).toBe(false);
  });
});