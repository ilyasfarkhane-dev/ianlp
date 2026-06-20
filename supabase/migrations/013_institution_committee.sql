-- Add institution committee type (must be committed before use in 014)
-- Safe to re-run

do $$ begin
  alter type public.committee_type add value 'institution';
exception
  when duplicate_object then null;
end $$;
