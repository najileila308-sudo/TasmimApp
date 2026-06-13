drop policy if exists "authenticated can read contact messages" on public.contact_messages;
drop policy if exists "authenticated can update contact messages" on public.contact_messages;
drop policy if exists "authenticated can delete contact messages" on public.contact_messages;
drop policy if exists "admin email can read contact messages" on public.contact_messages;
drop policy if exists "admin email can update contact messages" on public.contact_messages;
drop policy if exists "admin email can delete contact messages" on public.contact_messages;

create policy "admin email can read contact messages"
on public.contact_messages
for select
to authenticated
using (auth.email() = 'najileila308@gmail.com');

create policy "admin email can update contact messages"
on public.contact_messages
for update
to authenticated
using (auth.email() = 'najileila308@gmail.com')
with check (auth.email() = 'najileila308@gmail.com');

create policy "admin email can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (auth.email() = 'najileila308@gmail.com');
