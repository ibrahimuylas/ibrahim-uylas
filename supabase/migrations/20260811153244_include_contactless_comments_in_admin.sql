create or replace function public.list_comments_admin_internal(p_limit integer default 100)
returns table (
  id bigint, path text, title text, author_name text, email text, body text,
  status text, created_at timestamptz, root_comment_id bigint,
  reply_to_comment_id bigint, notify_replies boolean, email_verified boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, t.path, t.title, c.author_name, cc.email, c.body, c.status,
    c.created_at, c.root_comment_id, c.reply_to_comment_id,
    coalesce(cc.notify_replies, false), cc.email_verified_at is not null
  from public.comments c
  join public.comment_threads t on t.id = c.thread_id
  left join public.comment_contacts cc on cc.comment_id = c.id
  order by c.created_at desc
  limit least(greatest(p_limit, 1), 200);
$$;

revoke all on function public.list_comments_admin_internal(integer)
  from public, anon, authenticated;
grant execute on function public.list_comments_admin_internal(integer)
  to service_role;
