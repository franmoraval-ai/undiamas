import { NextResponse } from "next/server";
import { consumeRateLimit, getRequestIpHash, isSameOrigin, rateLimits } from "@/lib/security";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { voiceIdSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "El servicio no está configurado." }, { status: 503 });

  const { id } = await params;
  if (!voiceIdSchema.safeParse(id).success) return NextResponse.json({ error: "Voz inválida." }, { status: 400 });

  const ipHash = getRequestIpHash(request);
  if (!ipHash) return NextResponse.json({ error: "No pudimos identificar esta solicitud." }, { status: 503 });

  let allowed = true;
  try {
    allowed = await consumeRateLimit(supabase, `reaction:${ipHash}`, rateLimits.reaction);
  } catch (error) {
    console.error("Unable to consume reaction rate limit", error);
  }

  if (!allowed) {
    return NextResponse.json({ error: "Vuelve a intentarlo más tarde." }, { status: 429, headers: { "Retry-After": "300" } });
  }

  const { data, error } = await supabase.rpc("registrar_yo_tambien", { voz_uuid: id, actor_hash: ipHash });
  if (error || typeof data !== "number") {
    console.error("Unable to register accompaniment reaction", error);
    return NextResponse.json({ error: "No fue posible registrar este acompanamiento." }, { status: 503 });
  }

  return NextResponse.json({ count: data });
}