"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getModerator } from "@/lib/moderation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const moderationActionSchema = z.object({
  voiceId: z.string().uuid(),
  estado: z.enum(["aprobada", "en_revision", "rechazada"]),
});

const deleteVoiceSchema = z.object({
  voiceId: z.string().uuid(),
});

export async function moderateVoice(formData: FormData) {
  const moderator = await getModerator();
  if (!moderator) throw new Error("No autorizado.");

  const parsed = moderationActionSchema.safeParse({
    voiceId: formData.get("voiceId"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) throw new Error("Acción de moderación inválida.");

  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("El servicio no está configurado.");

  const { error } = await admin
    .from("voces")
    .update({ estado: parsed.data.estado })
    .eq("id", parsed.data.voiceId)
    .in("estado", ["pendiente", "en_revision"]);

  if (error) throw new Error("No fue posible guardar la decisión.");

  revalidatePath("/moderacion");
  revalidatePath("/voces");
}

export async function deleteVoice(formData: FormData) {
  const moderator = await getModerator();
  if (!moderator) throw new Error("No autorizado.");

  const parsed = deleteVoiceSchema.safeParse({ voiceId: formData.get("voiceId") });
  if (!parsed.success) throw new Error("Voz inválida.");

  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("El servicio no está configurado.");

  const { error } = await admin
    .from("voces")
    .delete()
    .eq("id", parsed.data.voiceId)
    .eq("estado", "aprobada");

  if (error) throw new Error("No fue posible eliminar esta voz.");

  revalidatePath("/moderacion");
  revalidatePath("/voces");
}