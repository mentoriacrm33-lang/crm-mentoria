import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Recebe o link de confirmação de e-mail do Supabase e cria a sessão.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/`);
  }

  const msg = encodeURIComponent("Link inválido ou expirado. Tente entrar novamente.");
  return NextResponse.redirect(`${origin}/login?erro=${msg}`);
}
