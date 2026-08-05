import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Voz } from "@/lib/voces";

export type ModerationVoice = Voz & { estado: "pendiente" | "en_revision" };
export type PublishedVoice = Voz & { estado: "aprobada" };

export async function getModerator() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("moderadores")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? user : null;
}

export async function getModerationQueue() {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("voces")
    .select("id, texto, categoria, fecha, yo_tambien, created_at, estado")
    .in("estado", ["pendiente", "en_revision"])
    .order("created_at", { ascending: true });

  if (error) throw new Error("Unable to load moderation queue.");
  return (data ?? []) as ModerationVoice[];
}

export async function getPublishedVoices() {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("voces")
    .select("id, texto, categoria, fecha, yo_tambien, created_at, estado")
    .eq("estado", "aprobada")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error("Unable to load published voices.");
  return (data ?? []) as PublishedVoice[];
}