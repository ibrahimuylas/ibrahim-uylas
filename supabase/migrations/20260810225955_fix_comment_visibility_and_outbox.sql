-- Hidden root comments and their replies must never appear in the public feed.
create or replace function public.list_comments_internal(
  p_path text,
  p_sort text default 'newest',
  p_cursor timestamptz default null,
  p_limit integer default 20
) returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with thread as (
    select id from public.comment_threads where path = p_path
  ), roots as (
    select c.*
    from public.comments c
    join thread t on t.id = c.thread_id
    where c.root_comment_id is null
      and c.status = 'published'
      and (p_cursor is null or
        (p_sort = 'oldest' and c.last_activity_at > p_cursor) or
        (p_sort <> 'oldest' and c.last_activity_at < p_cursor))
    order by
      case when p_sort = 'oldest' then c.last_activity_at end asc,
      case when p_sort <> 'oldest' then c.last_activity_at end desc,
      c.id desc
    limit least(greatest(p_limit, 1), 20) + 1
  ), page as (
    select * from roots
    order by
      case when p_sort = 'oldest' then last_activity_at end asc,
      case when p_sort <> 'oldest' then last_activity_at end desc,
      id desc
    limit least(greatest(p_limit, 1), 20)
  ), items as (
    select jsonb_build_object(
      'id', r.id,
      'authorName', r.author_name,
      'body', r.body,
      'status', r.status,
      'createdAt', r.created_at,
      'editedAt', r.edited_at,
      'replies', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', q.id,
          'authorName', q.author_name,
          'body', q.body,
          'status', q.status,
          'createdAt', q.created_at,
          'editedAt', q.edited_at,
          'replyToCommentId', q.reply_to_comment_id
        ) order by q.created_at, q.id)
        from public.comments q
        where q.root_comment_id = r.id and q.status = 'published'
      ), '[]'::jsonb)
    ) as item, r.last_activity_at
    from page r
  )
  select jsonb_build_object(
    'items', coalesce((select jsonb_agg(item order by
      case when p_sort = 'oldest' then last_activity_at end asc,
      case when p_sort <> 'oldest' then last_activity_at end desc
    ) from items), '[]'::jsonb),
    'nextCursor', case when (select count(*) from roots) > least(greatest(p_limit, 1), 20)
      then (select last_activity_at from page order by
        case when p_sort = 'oldest' then last_activity_at end desc,
        case when p_sort <> 'oldest' then last_activity_at end asc
        limit 1)
      else null end
  );
$$;

-- Recover jobs that were claimed by an interrupted invocation before claiming
-- the next batch. The 24-hour delivery window remains unchanged.
create or replace function public.claim_comment_email_jobs_internal(p_limit integer default 20)
returns setof public.comment_email_outbox
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.comment_email_outbox
  set state = 'failed',
      next_attempt_at = now(),
      last_error = coalesce(last_error, 'Recovered stale sending job'),
      updated_at = now()
  where state = 'sending'
    and updated_at < now() - interval '15 minutes'
    and attempt_count < 8
    and created_at > now() - interval '24 hours';

  return query
  with due as (
    select id from public.comment_email_outbox
    where state in ('pending', 'failed')
      and attempt_count < 8
      and next_attempt_at <= now()
      and created_at > now() - interval '24 hours'
    order by next_attempt_at, id
    for update skip locked
    limit least(greatest(p_limit, 1), 50)
  )
  update public.comment_email_outbox o
  set state = 'sending', attempt_count = attempt_count + 1,
      first_attempt_at = coalesce(first_attempt_at, now()), updated_at = now()
  from due where o.id = due.id
  returning o.*;
end;
$$;

revoke all on function public.list_comments_internal(text,text,timestamptz,integer) from public, anon, authenticated;
revoke all on function public.claim_comment_email_jobs_internal(integer) from public, anon, authenticated;
grant execute on function public.list_comments_internal(text,text,timestamptz,integer) to service_role;
grant execute on function public.claim_comment_email_jobs_internal(integer) to service_role;
