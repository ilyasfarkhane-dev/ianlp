-- Add scientific committee type
-- Safe to re-run

do $$ begin
  alter type public.committee_type add value 'scientific';
exception
  when duplicate_object then null;
end $$;
