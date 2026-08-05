alter type public.estado_voz add value if not exists 'en_revision';

create table public.moderadores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.moderadores enable row level security;
revoke all on public.moderadores from anon;
grant select on public.moderadores to authenticated;

create policy "Moderators can read their own role"
  on public.moderadores for select to authenticated
  using (auth.uid() = user_id);