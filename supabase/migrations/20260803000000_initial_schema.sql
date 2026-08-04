create extension if not exists "pgcrypto";

create type public.estado_voz as enum ('pendiente', 'aprobada', 'rechazada', 'archivada');
create type public.estado_reporte as enum ('pendiente', 'revisado', 'resuelto');

create table public.voces (
  id uuid primary key default gen_random_uuid(),
  texto text not null check (char_length(trim(texto)) between 24 and 2800),
  categoria text,
  fecha date not null default current_date,
  estado public.estado_voz not null default 'pendiente',
  yo_tambien integer not null default 0 check (yo_tambien >= 0),
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.reportes (
  id uuid primary key default gen_random_uuid(),
  voz_id uuid not null references public.voces(id) on delete cascade,
  motivo text not null check (char_length(trim(motivo)) between 3 and 500),
  ip_hash text,
  estado public.estado_reporte not null default 'pendiente',
  created_at timestamptz not null default now()
);

create table public.moderacion (
  id uuid primary key default gen_random_uuid(),
  voz_id uuid not null references public.voces(id) on delete cascade,
  accion public.estado_voz not null,
  nota text,
  moderador_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index voces_publicadas_recientes_idx on public.voces (created_at desc) where estado = 'aprobada';
create index reportes_pendientes_idx on public.reportes (created_at asc) where estado = 'pendiente';

alter table public.voces enable row level security;
alter table public.reportes enable row level security;
alter table public.moderacion enable row level security;

create policy "Las voces aprobadas son públicas"
  on public.voces for select
  using (estado = 'aprobada');

revoke all on public.voces, public.reportes, public.moderacion from anon, authenticated;

create or replace function public.incrementar_yo_tambien(voz_uuid uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  contador integer;
begin
  update public.voces
  set yo_tambien = yo_tambien + 1
  where id = voz_uuid and estado = 'aprobada'
  returning yo_tambien into contador;

  if contador is null then
    raise exception 'Voice is not available';
  end if;

  return contador;
end;
$$;

revoke all on function public.incrementar_yo_tambien(uuid) from public;
grant execute on function public.incrementar_yo_tambien(uuid) to service_role;