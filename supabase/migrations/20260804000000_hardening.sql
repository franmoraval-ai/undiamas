create table public.request_rate_limits (
  limit_key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1 check (request_count > 0),
  created_at timestamptz not null default now()
);

drop function if exists public.incrementar_yo_tambien(uuid);

create table public.reacciones_voz (
  voz_id uuid not null references public.voces(id) on delete cascade,
  ip_hash text not null check (char_length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  primary key (voz_id, ip_hash)
);

alter table public.request_rate_limits enable row level security;
alter table public.reacciones_voz enable row level security;
revoke all on public.request_rate_limits, public.reacciones_voz from anon, authenticated;

create or replace function public.consume_rate_limit(limit_key text, max_requests integer, window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  if max_requests < 1 or window_seconds < 1 then
    raise exception 'Invalid rate limit policy';
  end if;

  insert into public.request_rate_limits (limit_key)
  values (limit_key)
  on conflict (limit_key) do update
  set
    window_started_at = case
      when public.request_rate_limits.window_started_at < now() - make_interval(secs => window_seconds) then now()
      else public.request_rate_limits.window_started_at
    end,
    request_count = case
      when public.request_rate_limits.window_started_at < now() - make_interval(secs => window_seconds) then 1
      else public.request_rate_limits.request_count + 1
    end
  where public.request_rate_limits.window_started_at < now() - make_interval(secs => window_seconds)
    or public.request_rate_limits.request_count < max_requests
  returning true into allowed;

  return coalesce(allowed, false);
end;
$$;

create or replace function public.registrar_yo_tambien(voz_uuid uuid, actor_hash text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  reaction_created boolean := false;
  contador integer;
begin
  if char_length(actor_hash) <> 64 then
    raise exception 'Invalid actor hash';
  end if;

  insert into public.reacciones_voz (voz_id, ip_hash)
  select id, actor_hash from public.voces where id = voz_uuid and estado = 'aprobada'
  on conflict do nothing
  returning true into reaction_created;

  if reaction_created then
    update public.voces
    set yo_tambien = yo_tambien + 1
    where id = voz_uuid
    returning yo_tambien into contador;
  else
    select yo_tambien into contador from public.voces where id = voz_uuid and estado = 'aprobada';
  end if;

  if contador is null then
    raise exception 'Voice is not available';
  end if;

  return contador;
end;
$$;

create or replace function public.audit_voice_moderation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.moderacion (voz_id, accion, moderador_id)
    values (new.id, new.estado, auth.uid());
  end if;
  return new;
end;
$$;

create trigger voces_audit_moderation
after update of estado on public.voces
for each row execute function public.audit_voice_moderation();

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
revoke all on function public.registrar_yo_tambien(uuid, text) from public;
revoke all on function public.audit_voice_moderation() from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
grant execute on function public.registrar_yo_tambien(uuid, text) to service_role;