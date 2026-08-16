-- Adds Word Bank and Request Scale progress tracking, same shape as the
-- verb/scenario progress added in 0001_user_progress.sql.
alter table public.user_progress
  add column word_progress jsonb not null default '{}'::jsonb,
  add column request_progress jsonb not null default '{}'::jsonb;

-- increment_stats' default stats object and mode check need to grow to
-- cover the two new modes. create or replace keeps the same signature.
create or replace function public.increment_stats(
  p_mode text, p_delta_correct int, p_delta_total int
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  default_stats jsonb := '{
    "drills": {"correct": 0, "total": 0},
    "scenarios": {"correct": 0, "total": 0},
    "words": {"correct": 0, "total": 0},
    "requests": {"correct": 0, "total": 0}
  }'::jsonb;
begin
  if p_mode not in ('drills', 'scenarios', 'words', 'requests') then
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

-- Same atomic per-key increment pattern as increment_progress/increment_scenario_progress.
create or replace function public.increment_word_progress(p_key text, p_delta int)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.user_progress (user_id, word_progress)
  values (auth.uid(), jsonb_build_object(p_key, p_delta))
  on conflict (user_id) do update
    set word_progress = public.user_progress.word_progress ||
      jsonb_build_object(
        p_key,
        coalesce((public.user_progress.word_progress ->> p_key)::int, 0) + p_delta
      );
end;
$$;

create or replace function public.increment_request_progress(p_key text, p_delta int)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.user_progress (user_id, request_progress)
  values (auth.uid(), jsonb_build_object(p_key, p_delta))
  on conflict (user_id) do update
    set request_progress = public.user_progress.request_progress ||
      jsonb_build_object(
        p_key,
        coalesce((public.user_progress.request_progress ->> p_key)::int, 0) + p_delta
      );
end;
$$;

grant execute on function public.increment_word_progress(text, int) to authenticated;
grant execute on function public.increment_request_progress(text, int) to authenticated;
