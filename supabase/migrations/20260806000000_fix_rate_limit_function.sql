drop function if exists public.consume_rate_limit(text, integer, integer);

create function public.consume_rate_limit(
  p_limit_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  if p_max_requests < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit policy';
  end if;

  insert into public.request_rate_limits (limit_key)
  values (p_limit_key)
  on conflict (limit_key) do update
  set
    window_started_at = case
      when public.request_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
      else public.request_rate_limits.window_started_at
    end,
    request_count = case
      when public.request_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
      else public.request_rate_limits.request_count + 1
    end
  where public.request_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds)
    or public.request_rate_limits.request_count < p_max_requests
  returning true into allowed;

  return coalesce(allowed, false);
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;