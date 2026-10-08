create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (
    id,
    username,
    email,
    avatar,
    role,
    status,
    created_at
  )
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'username'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      '员工'
    ),
    new.email,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'avatar'), ''),
      'https://api.dicebear.com/10.x/lorelei/svg?seed=' ||
        encode(new.id::text::bytea, 'hex')
    ),
    'staff',
    'active',
    new.created_at
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();