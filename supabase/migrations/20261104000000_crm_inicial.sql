-- Já aplicada no projeto Supabase "CRM MENTORIA". Guardada aqui como histórico.

create table public.mentorados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 200),
  email text,
  telefone text,
  empresa text,
  objetivo text,
  etapa text not null default 'lead'
    check (etapa in ('lead', 'conversa', 'proposta', 'ativo', 'concluido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mentorados_user_id_idx on public.mentorados (user_id);

create table public.sessoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  mentorado_id uuid not null references public.mentorados (id) on delete cascade,
  data timestamptz not null,
  anotacoes text,
  proximos_passos text,
  created_at timestamptz not null default now()
);
create index sessoes_user_id_idx on public.sessoes (user_id);
create index sessoes_mentorado_id_idx on public.sessoes (mentorado_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger mentorados_updated_at
  before update on public.mentorados
  for each row execute function public.set_updated_at();

alter table public.mentorados enable row level security;
alter table public.sessoes enable row level security;

create policy "mentorados: ver os próprios" on public.mentorados
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "mentorados: criar os próprios" on public.mentorados
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "mentorados: editar os próprios" on public.mentorados
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "mentorados: apagar os próprios" on public.mentorados
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "sessoes: ver as próprias" on public.sessoes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "sessoes: criar as próprias" on public.sessoes
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.mentorados m where m.id = mentorado_id and m.user_id = (select auth.uid()))
  );
create policy "sessoes: editar as próprias" on public.sessoes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "sessoes: apagar as próprias" on public.sessoes
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.mentorados, public.sessoes from anon;
grant select, insert, update, delete on public.mentorados, public.sessoes to authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
