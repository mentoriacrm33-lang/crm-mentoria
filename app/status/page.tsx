// Página mínima para confirmar a ligação GitHub → Cloudflare → Supabase.
export const dynamic = "force-dynamic";

async function supabaseConectado() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key }, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function Home() {
  const ok = await supabaseConectado();
  return (
    <main>
      <p>GitHub → Cloudflare: conectado</p>
      <p>Cloudflare → Supabase: {ok ? "conectado" : "sem conexão"}</p>
    </main>
  );
}
