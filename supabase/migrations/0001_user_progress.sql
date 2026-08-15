-- One row per user, JSONB columns mirroring the existing client-side shapes
-- (lib/progress.ts's Progress, lib/scenario-progress.ts's ScenarioProgress,
-- lib/stats.ts's Stats) exactly, so the server is "the same objects, just
-- durable" rather than a separate normalized schema.
create table public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  scenario_progress jsonb not null default '{}'::jsonb,
  stats jsonb not null default
    '{"drills":{"correct":0,"total":0},"scenarios":{"correct":0,"total":0}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

revoke all on public.user_progress from anon;
grant select, insert, update on public.user_progress to authenticated;

create policy "select own row" on public.user_progress
  for select using (auth.uid() = user_id);

create policy "insert own row" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "update own row" on public.user_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- No delete policy: `on delete cascade` on auth.users handles account deletion.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- Atomic per-key increment for drill verb/target misses. security invoker so
-- RLS still applies to the underlying table; auth.uid() is used directly as
-- the target row, so there's no user-id argument a caller could spoof.
create or replace function public.increment_progress(p_key text, p_delta int)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.user_progress (user_id, progress)
  values (auth.uid(), jsonb_build_object(p_key, p_delta))
  on conflict (user_id) do update
    set progress = public.user_progress.progress ||
      jsonb_build_object(
        p_key,
        coalesce((public.user_progress.progress ->> p_key)::int, 0) + p_delta
      );
end;
$$;

-- Same shape for scenario misses.
create or replace function public.increment_scenario_progress(p_key text, p_delta int)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.user_progress (user_id, scenario_progress)
  values (auth.uid(), jsonb_build_object(p_key, p_delta))
  on conflict (user_id) do update
    set scenario_progress = public.user_progress.scenario_progress ||
      jsonb_build_object(
        p_key,
        coalesce((public.user_progress.scenario_progress ->> p_key)::int, 0) + p_delta
      );
end;
$$;

-- Same idea for the nested drills/scenarios accuracy counters.
create or replace function public.increment_stats(
  p_mode text, p_delta_correct int, p_delta_total int
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  default_stats jsonb :=
    '{"drills":{"correct":0,"total":0},"scenarios":{"correct":0,"total":0}}'::jsonb;
begin
  if p_mode not in ('drills', 'scenarios') then
    raise exception 'invalid mode: %', p_mode;
  end if;
  insert into public.user_progress (user_id, stats)
  values (
    auth.uid(),
    jsonb_set(default_stats, array[p_mode],
      jsonb_build_object('correct', p_delta_correct, 'total', p_delta_total))
  )
  on conflict (user_id) do update
    set stats = jsonb_set(
      public.user_progress.stats, array[p_mode],
      jsonb_build_object(
        'correct',
        coalesce((public.user_progress.stats #>> array[p_mode, 'correct'])::int, 0)
          + p_delta_correct,
        'total',
        coalesce((public.user_progress.stats #>> array[p_mode, 'total'])::int, 0)
          + p_delta_total
      )
    );
end;
$$;

grant execute on function public.increment_progress(text, int) to authenticated;
grant execute on function public.increment_scenario_progress(text, int) to authenticated;
grant execute on function public.increment_stats(text, int, int) to authenticated;
