-- Move existing organizing cards to institution committee
-- Safe to re-run

update public.committee_members
set committee_type = 'institution'
where committee_type = 'organizing';
