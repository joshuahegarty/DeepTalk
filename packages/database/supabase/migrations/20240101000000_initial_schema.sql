-- ============================================================
-- DeepTalk: Multi-tenant conversation intelligence schema
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Organisations
create table organisations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Workspaces
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  slug text unique not null,
  branding jsonb default '{}',
  settings jsonb default '{}',
  created_at timestamptz not null default now()
);

create index idx_workspaces_org on workspaces(org_id);
create index idx_workspaces_slug on workspaces(slug);

-- Departments
create table departments (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  colour text,
  settings jsonb default '{}'
);

create index idx_departments_workspace on departments(workspace_id);

-- Users (extends auth.users)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Roles
create table roles (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  permissions jsonb default '{}'
);

create index idx_roles_workspace on roles(workspace_id);

-- User-Workspace memberships
create table user_workspaces (
  user_id uuid not null references users(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  role_id uuid references roles(id) on delete set null,
  department_ids uuid[] default '{}',
  primary key (user_id, workspace_id)
);

create index idx_user_workspaces_workspace on user_workspaces(workspace_id);
create index idx_user_workspaces_user on user_workspaces(user_id);

-- Calls
create table calls (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  department_id uuid references departments(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  title text,
  call_type text,
  duration integer default 0,
  status text default 'pending',
  audio_url text,
  recording_state text default 'idle',
  sentiment text,
  score integer,
  created_at timestamptz not null default now()
);

create index idx_calls_workspace on calls(workspace_id);
create index idx_calls_user on calls(user_id);
create index idx_calls_department on calls(department_id);
create index idx_calls_created on calls(created_at desc);

-- Transcripts
create table transcripts (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid not null references calls(id) on delete cascade,
  full_text text,
  speaker_labels jsonb default '[]',
  segments jsonb default '[]'
);

create index idx_transcripts_call on transcripts(call_id);

-- Call Intelligence
create table call_intelligence (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid not null references calls(id) on delete cascade,
  summary text,
  action_items jsonb default '[]',
  sentiment text,
  score integer,
  topics jsonb default '[]',
  talk_ratio jsonb default '{}'
);

create index idx_call_intelligence_call on call_intelligence(call_id);

-- Knowledge Cards
create table knowledge_cards (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  category text,
  title text not null,
  summary text,
  content jsonb default '{}',
  status text default 'draft',
  priority text default 'medium',
  confidence_threshold integer default 80
);

create index idx_knowledge_cards_workspace on knowledge_cards(workspace_id);

-- CRM Sync Log
create table crm_sync_log (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid not null references calls(id) on delete cascade,
  crm_type text not null,
  status text default 'pending',
  attempts integer default 0,
  last_attempt timestamptz,
  error_message text
);

create index idx_crm_sync_log_call on crm_sync_log(call_id);

-- Coaching Events
create table coaching_events (
  id uuid primary key default uuid_generate_v4(),
  call_id uuid not null references calls(id) on delete cascade,
  manager_id uuid references users(id) on delete set null,
  type text,
  content text,
  timestamp_ref integer
);

create index idx_coaching_events_call on coaching_events(call_id);
create index idx_coaching_events_manager on coaching_events(manager_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper: check if current user is a member of a workspace
create or replace function is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_workspaces
    where user_id = auth.uid()
      and workspace_id = ws_id
  );
$$;

-- Helper: get all workspace IDs the current user belongs to
create or replace function user_workspace_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select workspace_id from user_workspaces
  where user_id = auth.uid();
$$;

-- ---- Organisations ----
alter table organisations enable row level security;

create policy "Users can view orgs they belong to"
  on organisations for select using (
    id in (
      select org_id from workspaces
      where id in (select user_workspace_ids())
    )
  );

-- ---- Workspaces ----
alter table workspaces enable row level security;

create policy "Users can view workspaces they are members of"
  on workspaces for select using (
    id in (select user_workspace_ids())
  );

-- ---- Departments ----
alter table departments enable row level security;

create policy "Users can view departments in their workspaces"
  on departments for select using (
    is_workspace_member(workspace_id)
  );

create policy "Users can manage departments in their workspaces"
  on departments for all using (
    is_workspace_member(workspace_id)
  );

-- ---- Users ----
alter table users enable row level security;

create policy "Users can view themselves"
  on users for select using (
    id = auth.uid()
  );

create policy "Users can view members of shared workspaces"
  on users for select using (
    id in (
      select user_id from user_workspaces
      where workspace_id in (select user_workspace_ids())
    )
  );

create policy "Users can update their own profile"
  on users for update using (
    id = auth.uid()
  );

-- ---- Roles ----
alter table roles enable row level security;

create policy "Users can view roles in their workspaces"
  on roles for select using (
    is_workspace_member(workspace_id)
  );

-- ---- User Workspaces ----
alter table user_workspaces enable row level security;

create policy "Users can view memberships in their workspaces"
  on user_workspaces for select using (
    workspace_id in (select user_workspace_ids())
  );

-- ---- Calls ----
alter table calls enable row level security;

create policy "Users can view calls in their workspaces"
  on calls for select using (
    is_workspace_member(workspace_id)
  );

create policy "Users can insert calls in their workspaces"
  on calls for insert with check (
    is_workspace_member(workspace_id)
  );

create policy "Users can update calls in their workspaces"
  on calls for update using (
    is_workspace_member(workspace_id)
  );

-- ---- Transcripts ----
alter table transcripts enable row level security;

create policy "Users can view transcripts for calls in their workspaces"
  on transcripts for select using (
    call_id in (
      select id from calls
      where workspace_id in (select user_workspace_ids())
    )
  );

-- ---- Call Intelligence ----
alter table call_intelligence enable row level security;

create policy "Users can view intelligence for calls in their workspaces"
  on call_intelligence for select using (
    call_id in (
      select id from calls
      where workspace_id in (select user_workspace_ids())
    )
  );

-- ---- Knowledge Cards ----
alter table knowledge_cards enable row level security;

create policy "Users can view knowledge cards in their workspaces"
  on knowledge_cards for select using (
    is_workspace_member(workspace_id)
  );

create policy "Users can manage knowledge cards in their workspaces"
  on knowledge_cards for all using (
    is_workspace_member(workspace_id)
  );

-- ---- CRM Sync Log ----
alter table crm_sync_log enable row level security;

create policy "Users can view CRM sync logs for calls in their workspaces"
  on crm_sync_log for select using (
    call_id in (
      select id from calls
      where workspace_id in (select user_workspace_ids())
    )
  );

-- ---- Coaching Events ----
alter table coaching_events enable row level security;

create policy "Users can view coaching events for calls in their workspaces"
  on coaching_events for select using (
    call_id in (
      select id from calls
      where workspace_id in (select user_workspace_ids())
    )
  );

create policy "Users can insert coaching events for calls in their workspaces"
  on coaching_events for insert with check (
    call_id in (
      select id from calls
      where workspace_id in (select user_workspace_ids())
    )
  );

-- ============================================================
-- TRIGGER: auto-create user profile on signup
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
