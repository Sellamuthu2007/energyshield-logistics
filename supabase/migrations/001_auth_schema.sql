-- Create the profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  organization text,
  role text not null check (role in ('government', 'procurement', 'shipping', 'refinery', 'executive', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
begin
  -- Auto-assign role based on email prefix for demo purposes
  -- e.g., 'government@energyshield.ai' -> 'government'
  user_role := split_part(new.email, '@', 1);
  
  -- Fallback if the prefix isn't a valid role
  if user_role not in ('government', 'procurement', 'shipping', 'refinery', 'executive', 'admin') then
    user_role := 'government'; 
  end if;

  insert into public.profiles (id, full_name, organization, role)
  values (
    new.id,
    'Demo User',
    'EnergyShield Demo Org',
    user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/*
INSTRUCTIONS:
1. Run this SQL script in your Supabase SQL Editor.
2. Go to the "Authentication" -> "Users" section in your Supabase dashboard.
3. Click "Add User" and create users for each dashboard with the following emails and your chosen password (e.g., admin123):
   - government@energyshield.ai
   - procurement@energyshield.ai
   - shipping@energyshield.ai
   - refinery@energyshield.ai
   - executive@energyshield.ai
4. The database trigger will automatically create their matching profiles with the correct roles!
*/
