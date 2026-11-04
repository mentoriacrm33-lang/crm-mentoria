-- A função criada pela opção "RLS automático" não precisa ser chamada pela API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
