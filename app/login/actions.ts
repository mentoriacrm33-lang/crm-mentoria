"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function campos(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function entrar(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(campos(formData));

  if (error) {
    redirect(`/login?erro=${encodeURIComponent("E-mail ou senha inválidos.")}`);
  }
  redirect("/");
}

export async function cadastrar(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { email, password } = campos(formData);

  if (password.length < 6) {
    redirect(`/login?erro=${encodeURIComponent("A senha precisa ter pelo menos 6 caracteres.")}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    redirect(`/login?erro=${encodeURIComponent(error.message)}`);
  }

  if (data.session) redirect("/");

  redirect(
    `/login?aviso=${encodeURIComponent("Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre.")}`,
  );
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
