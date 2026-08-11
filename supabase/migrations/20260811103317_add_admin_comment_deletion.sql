alter table public.comments
  drop constraint comments_root_comment_id_fkey,
  add constraint comments_root_comment_id_fkey
    foreign key (root_comment_id) references public.comments(id) on delete cascade;

alter table public.comments
  drop constraint comments_reply_to_comment_id_fkey,
  add constraint comments_reply_to_comment_id_fkey
    foreign key (reply_to_comment_id) references public.comments(id) on delete cascade;

alter table public.comment_moderation_events
  drop constraint comment_moderation_events_comment_id_fkey,
  alter column comment_id drop not null,
  add constraint comment_moderation_events_comment_id_fkey
    foreign key (comment_id) references public.comments(id) on delete set null;

alter table public.comment_moderation_events
  drop constraint comment_moderation_events_action_check,
  add constraint comment_moderation_events_action_check
    check (action in ('hide', 'restore', 'edit', 'reply', 'delete'));

grant delete on table public.comments to service_role;

create or replace function public.delete_comment_internal(
  p_comment_id bigint,
  p_admin_user_id uuid
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_comment public.comments;
  v_thread public.comment_threads;
begin
  select * into v_comment
  from public.comments
  where id = p_comment_id
  for update;

  if not found then return false; end if;

  select * into v_thread
  from public.comment_threads
  where id = v_comment.thread_id;

  insert into public.comment_moderation_events(
    comment_id, admin_user_id, action, details
  ) values (
    v_comment.id,
    p_admin_user_id,
    'delete',
    jsonb_build_object(
      'path', v_thread.path,
      'title', v_thread.title,
      'authorName', v_comment.author_name,
      'body', v_comment.body
    )
  );

  delete from public.comments where id = v_comment.id;
  return true;
end;
$$;

revoke all on function public.delete_comment_internal(bigint,uuid)
  from public, anon, authenticated;
grant execute on function public.delete_comment_internal(bigint,uuid)
  to service_role;
