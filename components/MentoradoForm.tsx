import { ETAPAS, type Mentorado } from "@/lib/etapas";

export function MentoradoForm({
  action,
  mentorado,
  botao,
}: {
  action: (formData: FormData) => Promise<void>;
  mentorado?: Mentorado;
  botao: string;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label" htmlFor="nome">Nome *</label>
        <input className="input" id="nome" name="nome" required maxLength={200} defaultValue={mentorado?.nome} />
      </div>
      <div>
        <label className="label" htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" defaultValue={mentorado?.email ?? ""} />
      </div>
      <div>
        <label className="label" htmlFor="telefone">Telefone / WhatsApp</label>
        <input className="input" id="telefone" name="telefone" defaultValue={mentorado?.telefone ?? ""} />
      </div>
      <div>
        <label className="label" htmlFor="empresa">Empresa</label>
        <input className="input" id="empresa" name="empresa" defaultValue={mentorado?.empresa ?? ""} />
      </div>
      <div>
        <label className="label" htmlFor="etapa">Etapa do funil</label>
        <select className="input" id="etapa" name="etapa" defaultValue={mentorado?.etapa ?? "lead"}>
          {ETAPAS.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="objetivo">Objetivo</label>
        <textarea className="input min-h-20" id="objetivo" name="objetivo" defaultValue={mentorado?.objetivo ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <button className="btn">{botao}</button>
      </div>
    </form>
  );
}
