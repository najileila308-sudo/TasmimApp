drop policy if exists "authenticated can read contact messages" on public.contact_messages;

create policy "admin email can read contact messages"
on public.contact_messages
for select
to authenticated
using (auth.email() = 'najileila308@gmail.com');
