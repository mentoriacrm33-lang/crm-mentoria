import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import type { Mentorado } from "@/lib/etapas";
import { Kanban } from "@/components/Kanban";

export default async function FunilPage() {
  const { supabase } = await getUser();
  const { data } = await supabase.from("mentorados").select("*").order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Funil</h1>
          <p className="text-sm text-slate-500">Arraste os cartões entre as colunas para mudar a etapa.</p>
        </div>
        <Link href="/mentorados#novo" className="btn">+ Novo mentorado</Link>
      </div>
      <Kanban mentorados={(data ?? []) as Mentorado[]} />
    </div>
  );
}
