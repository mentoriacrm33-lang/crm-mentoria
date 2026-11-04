import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { ETAPAS, etapaInfo, type Mentorado } from "@/lib/etapas";
import { MentoradoForm } from "@/components/MentoradoForm";
import { criarMentorado } from "../actions";

export default async function MentoradosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; etapa?: string }>;
}) {
  const { q = "", etapa = "" } = await searchParams;
  const { supabase } = await getUser();

  let consulta = supabase.from("mentorados").select("*").order("nome");
  if (etapa) consulta = consulta.eq("etapa", etapa);
  if (q) {
    const termo = q.replace(/[%,()]/g, " ");
    consulta = consulta.or(`nome.ilike.%${termo}%,email.ilike.%${termo}%,empresa.ilike.%${termo}%`);
  }
  const { data } = await consulta;
  const lista = (data ?? []) as Mentorado[];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Mentorados</h1>

      <section className="card">
        <form className="mb-4 flex flex-wrap gap-2">
          <input className="input max-w-xs" name="q" placeholder="Buscar por nome, e-mail ou empresa" defaultValue={q} />
          <select className="input max-w-48" name="etapa" defaultValue={etapa}>
            <option value="">Todas as etapas</option>
            {ETAPAS.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
          <button className="btn-secondary">Filtrar</button>
        </form>

        {lista.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum mentorado encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nome</th>
                  <th className="py-2 pr-4 font-medium">Empresa</th>
                  <th className="py-2 pr-4 font-medium">Contato</th>
                  <th className="py-2 font-medium">Etapa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2 pr-4">
                      <Link href={`/mentorados/${m.id}`} className="font-medium text-indigo-700 hover:underline">
                        {m.nome}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{m.empresa ?? "—"}</td>
                    <td className="py-2 pr-4 text-slate-600">{m.email ?? m.telefone ?? "—"}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${etapaInfo(m.etapa).cor}`}>
                        {etapaInfo(m.etapa).nome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="novo" className="card">
        <h2 className="mb-4 font-semibold">Novo mentorado</h2>
        <MentoradoForm action={criarMentorado} botao="Cadastrar" />
      </section>
    </div>
  );
}
