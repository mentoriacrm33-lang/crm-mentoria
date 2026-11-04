# CRM Mentoria

CRM para organizar mentorados, o funil de vendas da mentoria e as sessões realizadas.

Feito com **Next.js**, **Supabase** (login e banco de dados) e publicado no **Cloudflare Workers**.

## O que o app faz

- **Login** com e-mail e senha. Cada pessoa só vê os próprios dados.
- **Painel** com números rápidos: leads, mentorados ativos, concluídos e sessões da semana.
- **Mentorados**: cadastro com nome, e-mail, telefone, empresa, objetivo e etapa. Tem busca e filtro.
- **Funil**: quadro com as etapas *Lead → Conversa → Proposta → Mentorado ativo → Concluído*. Arraste os cartões para mudar a etapa (no celular, use a caixa de seleção do cartão).
- **Sessões**: data, anotações e próximos passos de cada encontro.

## Como o app vai ao ar

O Cloudflare está ligado a este repositório. Toda mudança enviada para a branch `main` é publicada sozinha.

Configuração no Cloudflare (Workers & Pages → crm-mentoria → Settings → Build):

| Campo | Valor |
|---|---|
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Variáveis de build | `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

## Configuração do login no Supabase (uma vez)

Para o link de confirmação de e-mail voltar para o app:

1. Supabase → **Authentication → URL Configuration**.
2. Em **Site URL**, coloque o endereço do app (ex.: `https://crm-mentoria.SEU-USUARIO.workers.dev`).
3. Em **Redirect URLs**, adicione `https://crm-mentoria.SEU-USUARIO.workers.dev/auth/callback`.

## Rodar no seu computador (opcional)

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install
cp .env.example .env.local   # depois preencha com os dados do Supabase
npm run dev
```

Abra http://localhost:3000.

## Banco de dados

As tabelas ficam em `supabase/migrations/`. Elas já foram aplicadas no projeto Supabase **CRM MENTORIA**:

- `mentorados`: dados de cada pessoa e a etapa do funil.
- `sessoes`: encontros ligados a um mentorado.

Todas as tabelas usam *Row Level Security*: cada usuário só lê e altera o que é dele.
