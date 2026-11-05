import { redirect } from "next/navigation";

// O CRM Closer é servido como página estática em /crm/index.html (export do protótipo).
// A verificação de conexão com o Supabase fica em /status.
export default function Home() {
  redirect("/crm/index.html");
}
