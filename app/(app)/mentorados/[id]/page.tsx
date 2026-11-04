import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { etapaInfo, formatarData, type Mentorado, type Sessao } from "@/lib/etapas";
import { MentoradoForm } from "@/components/MentoradoForm";
import { ConfirmButton } from "@/components/ConfirmButton";
import { apagarMentorado, apagarSessao, atualizarMentorado, criarSessao } from "../../actions";

export default async function MentoradoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getUser();

  const [{ data: mentorado }, { data: sessoesData }] = await Promise.all([
    supabase.from("mentorados").select("*").eq("id", id).maybeSingle(),
    supabase.from("sessoes").select("*").eq("mentorado_id", id).order("data", { ascending: false }),
  ]);

  if (!mentorado) notFound();
  const m = mentorado as Mentorado;
  const sessoes = (sessoesData ?? []) as Sessao[];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/mentorados" className="text-sm text-slate-500 hover:underline">← Mentorados</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{m.nome}</h1>
          <span className={`rounded-full px-2 py-0.5 text-xs ${etapaInfo(m.etapa).cor}`}>
            {etapaInfo(m.etapa).nome}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card lg:col-span-3">
          <h2 className="mb-4 font-semibold">Sessões</h2>

          <form action={criarSessao.bind(null, m.id)} className="mb-6 grid gap-3 rounded-lg bg-slate-50 p-4">
            <div>
              <label className="label" htmlFor="data">Data e hora (horário de Brasília) *</label>
              <input className="input max-w-64" id="data" name="data" type="datetime-local" required />
            </div>
            <div>
              <label className="label" htmlFor="anotacoes">Anotações</label>
              <textarea className="input min-h-20" id="anotacoes" name="anotacoes" />
            </div>
            <div>
              <label className="label" htmlFor="proximos_passos">Próximos passos</label>
              <textarea className="input min-h-16" id="proximos_passos" name="proximos_passos" />
            </div>
            <div>
              <button className="btn">Registrar sessão</button>
            </div>
          </form>

          {sessoes.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma sessão registrada ainda.</p>
          ) : (
            <ul className="space-y-4">
              {sessoes.map((s) => (
                <li key={s.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium">{formatarData(s.data)}</p>
                    <form action={apagarSessao.bind(null, s.id)}>
                      <ConfirmButton mensagem="Apagar esta sessão?">Apagar</ConfirmButton>
                    </form>
                  </div>
                  {s.anotacoes && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{s.anotacoes}</p>
                  )}
                  {s.proximos_passos && (
                    <div className="mt-3 rounded-md bg-indigo-50 p-3 text-sm">
                      <p className="font-medium text-indigo-800">Próximos passos</p>
                      <p className="mt-1 whitespace-pre-wrap text-indigo-900">{s.proximos_passos}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card h-fit lg:col-span-2">
          <h2 className="mb-4 font-semibold">Dados</h2>
          <MentoradoForm action={atualizarMentorado.bind(null, m.id)} mentorado={m} botao="Salvar alterações" />
          <form action={apagarMentorado.bind(null, m.id)} className="mt-6 border-t border-slate-100 pt-4">
            <ConfirmButton mensagem="Apagar este mentorado e todas as sessões dele? Não dá para desfazer.">
              Apagar mentorado e todas as sessões
            </ConfirmButton>
          </form>
        </section>
      </div>
    </div>
  );
}
