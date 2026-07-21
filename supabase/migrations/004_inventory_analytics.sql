drop table if exists public.system_analytics cascade;

create table public.system_analytics (
  id uuid default gen_random_uuid() primary key,
  metric_name text not null,
  metric_value double precision not null,
  category text not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.system_analytics enable row level security;

create policy "Anyone authenticated can view system_analytics" on public.system_analytics for select to authenticated using (true);

alter publication supabase_realtime add table public.system_analytics;

insert into public.system_analytics (metric_name, metric_value, category) values
('Total Procurement Savings', 12.5, 'finance'),
('Average Delivery SLA', 18.2, 'logistics'),
('Global Supplier Risk Index', 42.0, 'risk');
