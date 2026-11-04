import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { cadastrar, entrar } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; aviso?: string }>;
}) {
  const { user } = await getUser();
  if (user) redirect("/");

  const { erro, aviso } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">CRM Mentoria</h1>
          <p className="mt-1 text-sm text-slate-500">Entre para gerenciar seus mentorados</p>
        </div>

        <form className="card space-y-4">
          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
          )}
          {aviso && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{aviso}</p>
          )}
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input className="input" id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha</label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button className="btn" formAction={entrar}>Entrar</button>
            <button className="btn-secondary" formAction={cadastrar}>Criar conta</button>
          </div>
        </form>
      </div>
    </main>
  );
}
