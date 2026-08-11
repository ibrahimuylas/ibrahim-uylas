alter table public.comments
  drop constraint comments_source_check,
  add constraint comments_source_check
    check (source in ('native', 'disqus'));
