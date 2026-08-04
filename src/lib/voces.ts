import { createSupabasePublicClient } from "@/lib/supabase/server";

export type Voz = {
  id: string;
  texto: string;
  categoria: string | null;
  fecha: string;
  yo_tambien: number;
  created_at: string;
};

const voiceColumns = "id, texto, categoria, fecha, yo_tambien, created_at";

export async function getApprovedVoces() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { voices: [], unavailable: true };

  const { data, error } = await supabase
    .from("voces")
    .select(voiceColumns)
    .eq("estado", "aprobada")
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("Unable to load approved voices", error);
    return { voices: [], unavailable: true };
  }

  return { voices: (data ?? []) as Voz[], unavailable: false };
}

export async function getApprovedVoz(id: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("voces")
    .select(voiceColumns)
    .eq("id", id)
    .eq("estado", "aprobada")
    .maybeSingle();

  if (error) {
    console.error("Unable to load approved voice", error);
    throw new Error("Unable to load approved voice");
  }

  return data as Voz | null;
}