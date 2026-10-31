-- Draft schema for the Copilote Bac learning dashboard.
-- Apply only after the project owner confirms the Supabase project reference.
create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  school_name text,
  grade text not null default 'Terminale S',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  chapter text not null,
  status text not null default 'not_started' check (status in ('not_started','in_progress','fragile','mastered')),
  mastery_percent integer not null default 0 check (mastery_percent between 0 and 100),
  last_activity_at timestamptz,
  next_review_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, subject, chapter)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  chapter text,
  quiz_type text not null default 'practice',
  score numeric(5,2) not null check (score between 0 and 100),
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null check (correct_answers between 0 and total_questions),
  source_label text not null default 'Exercice d’entraînement inédit — non officiel',
  completed_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  chapter text,
  activity text not null,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  completed_at timestamptz not null default now()
);

create table if not exists public.revision_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  chapter text not null,
  review_stage text not null check (review_stage in ('J1','J3','J7','J14')),
  due_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists chapter_progress_user_subject_idx on public.chapter_progress(user_id, subject);
create index if not exists quiz_attempts_user_date_idx on public.quiz_attempts(user_id, completed_at desc);
create index if not exists study_sessions_user_date_idx on public.study_sessions(user_id, completed_at desc);
create index if not exists revision_schedule_user_due_idx on public.revision_schedule(user_id, due_at);

alter table public.student_profiles enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.study_sessions enable row level security;
alter table public.revision_schedule enable row level security;

create policy "student_profiles_select_own" on public.student_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "student_profiles_insert_own" on public.student_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "student_profiles_update_own" on public.student_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "chapter_progress_select_own" on public.chapter_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "chapter_progress_insert_own" on public.chapter_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "chapter_progress_update_own" on public.chapter_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "chapter_progress_delete_own" on public.chapter_progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "quiz_attempts_select_own" on public.quiz_attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy "quiz_attempts_insert_own" on public.quiz_attempts for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "study_sessions_select_own" on public.study_sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy "study_sessions_insert_own" on public.study_sessions for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "revision_schedule_select_own" on public.revision_schedule for select to authenticated using ((select auth.uid()) = user_id);
create policy "revision_schedule_insert_own" on public.revision_schedule for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "revision_schedule_update_own" on public.revision_schedule for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update on public.student_profiles to authenticated;
grant select, insert, update, delete on public.chapter_progress to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select, insert on public.study_sessions to authenticated;
grant select, insert, update on public.revision_schedule to authenticated;
