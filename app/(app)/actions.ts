"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { isEtapa } from "@/lib/etapas";

function texto(formData: FormData, campo: string) {
  const valor = String(formData.get(campo) ?? "").trim();
  return valor === "" ? null : valor;
}

// O campo datetime-local não tem fuso; tratamos como horário de Brasília.
function dataBrasilia(valor: string) {
  return new Date(`${valor}:00-03:00`).toISOString();
}

async function exigirUsuario() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  return supabase;
}

function dadosMentorado(formData: FormData) {
  const etapa = formData.get("etapa");
  return {
    nome: texto(formData, "nome") ?? "",
    email: texto(formData, "email"),
    telefone: texto(formData, "telefone"),
    empresa: texto(formData, "empresa"),
    objetivo: texto(formData, "objetivo"),
    etapa: isEtapa(etapa) ? etapa : "lead",
  };
}

export async function criarMentorado(formData: FormData) {
  const supabase = await exigirUsuario();
  const dados = dadosMentorado(formData);
  if (!dados.nome) return;

  const { data, error } = await supabase.from("mentorados").insert(dados).select("id").single();
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(`/mentorados/${data.id}`);
}

export async function atualizarMentorado(id: string, formData: FormData) {
  const supabase = await exigirUsuario();
  const dados = dadosMentorado(formData);
  if (!dados.nome) return;

  const { error } = await supabase.from("mentorados").update(dados).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function apagarMentorado(id: string) {
  const supabase = await exigirUsuario();
  const { error } = await supabase.from("mentorados").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/mentorados");
}

export async function moverEtapa(id: string, etapa: string) {
  if (!isEtapa(etapa)) return;
  const supabase = await exigirUsuario();
  const { error } = await supabase.from("mentorados").update({ etapa }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function criarSessao(mentoradoId: string, formData: FormData) {
  const supabase = await exigirUsuario();
  const data = texto(formData, "data");
  if (!data) return;

  const { error } = await supabase.from("sessoes").insert({
    mentorado_id: mentoradoId,
    data: dataBrasilia(data),
    anotacoes: texto(formData, "anotacoes"),
    proximos_passos: texto(formData, "proximos_passos"),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function apagarSessao(id: string) {
  const supabase = await exigirUsuario();
  const { error } = await supabase.from("sessoes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
