export const ETAPAS = [
  { id: "lead", nome: "Lead", cor: "bg-slate-100 text-slate-700" },
  { id: "conversa", nome: "Conversa", cor: "bg-sky-100 text-sky-800" },
  { id: "proposta", nome: "Proposta", cor: "bg-amber-100 text-amber-800" },
  { id: "ativo", nome: "Mentorado ativo", cor: "bg-emerald-100 text-emerald-800" },
  { id: "concluido", nome: "Concluído", cor: "bg-violet-100 text-violet-800" },
] as const;

export type Etapa = (typeof ETAPAS)[number]["id"];

export function isEtapa(valor: unknown): valor is Etapa {
  return ETAPAS.some((e) => e.id === valor);
}

export function etapaInfo(id: string) {
  return ETAPAS.find((e) => e.id === id) ?? ETAPAS[0];
}

export type Mentorado = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  objetivo: string | null;
  etapa: Etapa;
  created_at: string;
  updated_at: string;
};

export type Sessao = {
  id: string;
  mentorado_id: string;
  data: string;
  anotacoes: string | null;
  proximos_passos: string | null;
  created_at: string;
};

export function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}
