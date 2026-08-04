import { z } from "zod";

export const createVoiceSchema = z.object({
  texto: z.string().trim().min(24).max(2800),
});

export const createReportSchema = z.object({
  vozId: z.string().uuid(),
  motivo: z.string().trim().min(3).max(500),
});

export const voiceIdSchema = z.string().uuid();