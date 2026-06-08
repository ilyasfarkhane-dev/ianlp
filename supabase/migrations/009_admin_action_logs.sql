-- Admin action audit logs (super admin read-only dashboard)

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  action text not null check (action in ('create', 'update', 'delete', 'login', 'logout')),
  resource text not null,
  resource_id text,
  resource_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_action_logs_created_at_idx
  on public.admin_action_logs (created_at desc);

create index if not exists admin_action_logs_user_email_idx
  on public.admin_action_logs (user_email);

create index if not exists admin_action_logs_action_idx
  on public.admin_action_logs (action);

alter table public.admin_action_logs enable row level security;

-- Authenticated users may insert logs only for their own email
create policy "Authenticated can insert own audit logs"
  on public.admin_action_logs
  for insert
  to authenticated
  with check (lower(user_email) = lower(auth.jwt() ->> 'email'));

-- Super admin may read all audit logs
create policy "Super admin can read audit logs"
  on public.admin_action_logs
  for select
  to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('idevo4281@gmail.com'));
