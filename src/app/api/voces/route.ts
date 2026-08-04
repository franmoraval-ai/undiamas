import { NextResponse } from "next/server";
import { consumeRateLimit, getRequestIpHash, isSameOrigin, rateLimits } from "@/lib/security";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createVoiceSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "El servicio no está configurado." }, { status: 503 });

  const ipHash = getRequestIpHash(request);
  if (!ipHash) return NextResponse.json({ error: "No pudimos identificar esta solicitud." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = createVoiceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "El texto debe tener entre 24 y 2800 caracteres." }, { status: 400 });

  try {
    const allowed = await consumeRateLimit(supabase, `voice:${ipHash}`, rateLimits.voice);
    if (!allowed) return NextResponse.json({ error: "Has compartido varias voces. Vuelve a intentarlo más tarde." }, { status: 429, headers: { "Retry-After": "900" } });
  } catch (error) {
    console.error("Unable to consume voice rate limit", error);
    return NextResponse.json({ error: "Esta accion no esta disponible en este momento." }, { status: 503 });
  }

  const { error } = await supabase.from("voces").insert({
    texto: parsed.data.texto,
    estado: "pendiente",
    ip_hash: ipHash,
  });

  if (error) return NextResponse.json({ error: "No pudimos recibir tu voz todavía." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}