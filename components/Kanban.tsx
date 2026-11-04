"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { ETAPAS, type Etapa, type Mentorado } from "@/lib/etapas";
import { moverEtapa } from "@/app/(app)/actions";

export function Kanban({ mentorados }: { mentorados: Mentorado[] }) {
  const [, startTransition] = useTransition();
  const [lista, mover] = useOptimistic(mentorados, (atual, { id, etapa }: { id: string; etapa: Etapa }) =>
    atual.map((m) => (m.id === id ? { ...m, etapa } : m)),
  );

  function trocar(id: string, etapa: Etapa) {
    startTransition(async () => {
      mover({ id, etapa });
      await moverEtapa(id, etapa);
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {ETAPAS.map((etapa) => {
        const cards = lista.filter((m) => m.etapa === etapa.id);
        return (
          <section
            key={etapa.id}
            className="flex min-h-48 flex-col rounded-xl bg-slate-100 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/plain");
              if (id) trocar(id, etapa.id);
            }}
          >
            <header className="mb-3 flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${etapa.cor}`}>{etapa.nome}</span>
              <span className="text-xs text-slate-500">{cards.length}</span>
            </header>
            <div className="flex flex-1 flex-col gap-2">
              {cards.map((m) => (
                <article
                  key={m.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", m.id)}
                  className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                >
                  <Link href={`/mentorados/${m.id}`} className="font-medium text-slate-900 hover:underline">
                    {m.nome}
                  </Link>
                  {m.empresa && <p className="text-xs text-slate-500">{m.empresa}</p>}
                  <select
                    aria-label="Mover para etapa"
                    className="mt-2 w-full rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs md:hidden"
                    value={m.etapa}
                    onChange={(e) => trocar(m.id, e.target.value as Etapa)}
                  >
                    {ETAPAS.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
