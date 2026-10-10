# Phase 5: Guest messages and admin

## Goal
Guests write a message (name + text). Only the owner reads them in /admin.

## Supabase setup (run in the SQL editor)
Replace `YOUR_ADMIN_EMAIL` with your email.
```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "guests can insert" on messages
  for insert to anon with check (true);

create policy "admin can read" on messages
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

create policy "admin can delete" on messages
  for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');
```
Then in Supabase: Authentication, create ONE user with your email, and disable public sign-ups.

## Prompt
```
Read PROJECT.md. Implement guest messages with Supabase.
- lib/supabaseClient.js reading VITE_ env vars.
- MessageForm.jsx: fields name (max 60) and message (max 500, with a live counter), a hidden honeypot field (if filled, silently pretend success), disable the button while sending, friendly Arabic error text on failure. On success show a thank-you state with a gentle petals animation (CSS/Framer, no heavy libs).
- Use the gold-frame style for the form; inputs cream background, gold border, Amiri font, RTL.
- pages/Admin.jsx: email + password login via Supabase Auth, then a list of messages newest first with name, text, time (ar-EG), a total count, a delete button with confirmation, and a "تصدير CSV" button. Add logout.
- /admin is not linked anywhere and has noindex.
Do NOT put any secret in the code. Show me your plan first.
```

## Definition of done
- Insert works from the public page; a guest cannot read messages (verify by trying a select with the anon key).
- Only the admin email can see/delete messages in /admin.
- Public sign-ups are disabled in Supabase.
- Empty and over-limit inputs are rejected with clear messages.
