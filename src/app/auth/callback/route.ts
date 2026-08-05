import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") === "/moderacion" ? "/moderacion" : "/";
  const response = NextResponse.redirect(new URL(next, url.origin));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code || !supabaseUrl || !supabaseAnonKey) return response;

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) return NextResponse.redirect(new URL("/moderacion?error=auth", url.origin));

  const moderatorEmail = process.env.MODERATOR_EMAIL?.trim().toLowerCase();
  if (moderatorEmail && data.user.email.toLowerCase() === moderatorEmail) {
    const admin = createSupabaseAdminClient();
    await admin?.from("moderadores").upsert({ user_id: data.user.id, email: data.user.email }, { onConflict: "user_id" });
  }

  return response;
}