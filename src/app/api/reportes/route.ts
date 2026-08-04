import { NextResponse } from "next/server";
import { consumeRateLimit, getRequestIpHash, isSameOrigin, rateLimits } from "@/lib/security";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createReportSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "El servicio no está configurado." }, { status: 503 });

  const ipHash = getRequestIpHash(request);
  if (!ipHash) return NextResponse.json({ error: "No pudimos verificar esta solicitud." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Reporte inválido." }, { status: 400 });

  try {
    const allowed = await consumeRateLimit(supabase, `report:${ipHash}`, rateLimits.report);
    if (!allowed) return NextResponse.json({ error: "Has enviado varios reportes. Vuelve a intentarlo más tarde." }, { status: 429, headers: { "Retry-After": "900" } });
  } catch {
    return NextResponse.json({ error: "No pudimos verificar esta solicitud." }, { status: 503 });
  }

  const { error } = await supabase.from("reportes").insert({ voz_id: parsed.data.vozId, motivo: parsed.data.motivo, ip_hash: ipHash });

  if (error) return NextResponse.json({ error: "No fue posible enviar el reporte." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}