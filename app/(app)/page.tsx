import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { ETAPAS, etapaInfo, formatarData, type Mentorado, type Sessao } from "@/lib/etapas";

export default async function Painel() {
  const { supabase } = await getUser();

  const agora = new Date();
  const emSeteDias = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [{ data: mentorados }, { data: proximas }] = await Promise.all([
    supabase.from("mentorados").select("*").order("updated_at", { ascending: false }),
    supabase
      .from("sessoes")
      .select("*, mentorados(nome)")
      .gte("data", agora.toISOString())
      .lte("data", emSeteDias.toISOString())
      .order("data"),
  ]);

  const lista = (mentorados ?? []) as Mentorado[];
  const sessoes = (proximas ?? []) as (Sessao & { mentorados: { nome: string } | null })[];

  const total = (etapa: string) => lista.filter((m) => m.etapa === etapa).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Painel</h1>
        <Link href="/mentorados#novo" className="btn">+ Novo mentorado</Link>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Numero titulo="Leads" valor={total("lead") + total("conversa") + total("proposta")} />
        <Numero titulo="Mentorados ativos" valor={total("ativo")} />
        <Numero titulo="Concluídos" valor={total("concluido")} />
        <Numero titulo="Sessões nos próximos 7 dias" valor={sessoes.length} />
      </section>

      <section className="card">
        <h2 className="mb-4 font-semibold">Funil</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ETAPAS.map((e) => (
            <Link key={e.id} href="/funil" className={`rounded-lg px-3 py-3 ${e.cor}`}>
              <p className="text-xs font-medium">{e.nome}</p>
              <p className="text-2xl font-semibold">{total(e.id)}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 font-semibold">Próximas sessões</h2>
          {sessoes.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma sessão marcada para os próximos 7 dias.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {sessoes.map((s) => (
                <li key={s.id} className="py-2">
                  <Link href={`/mentorados/${s.mentorado_id}`} className="flex justify-between gap-4 text-sm">
                    <span className="font-medium">{s.mentorados?.nome ?? "Mentorado"}</span>
                    <span className="text-slate-500">{formatarData(s.data)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="mb-4 font-semibold">Atualizados recentemente</h2>
          {lista.length === 0 ? (
            <p className="text-sm text-slate-500">
              Você ainda não tem mentorados.{" "}
              <Link href="/mentorados#novo" className="text-indigo-600 hover:underline">Cadastre o primeiro</Link>.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lista.slice(0, 6).map((m) => (
                <li key={m.id} className="py-2">
                  <Link href={`/mentorados/${m.id}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">{m.nome}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${etapaInfo(m.etapa).cor}`}>
                      {etapaInfo(m.etapa).nome}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Numero({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="mt-1 text-3xl font-semibold">{valor}</p>
    </div>
  );
}
