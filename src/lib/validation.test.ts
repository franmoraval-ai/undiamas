import { describe, expect, it } from "vitest";
import { createReportSchema, createVoiceSchema } from "./validation";

describe("public mutation validation", () => {
  it("accepts a voice within the allowed length", () => {
    expect(createVoiceSchema.safeParse({ texto: "Necesitaba decir esto en algún lugar seguro." }).success).toBe(true);
  });

  it("rejects a voice that is too short", () => {
    expect(createVoiceSchema.safeParse({ texto: "Muy poco" }).success).toBe(false);
  });

  it("requires a UUID and a meaningful reason for reports", () => {
    expect(createReportSchema.safeParse({ vozId: "not-a-uuid", motivo: "x" }).success).toBe(false);
  });
});