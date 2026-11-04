import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="card text-center">
      <p className="font-medium">Mentorado não encontrado.</p>
      <Link href="/mentorados" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">
        Voltar para a lista
      </Link>
    </div>
  );
}
