-- Add submission card link URLs to existing submission settings
-- Safe to re-run

update public.site_settings
set
  value = jsonb_set(
    jsonb_set(
      value,
      '{en,platformUrl}',
      '"https://easychair.org/conferences/?conf=ianlp2026"'::jsonb,
      true
    ),
    '{en,formatUrl}',
    '"https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"'::jsonb,
    true
  ),
  updated_at = now()
where key = 'submission'
  and (
    value #>> '{en,platformUrl}' is null
    or value #>> '{en,platformUrl}' = ''
    or value #>> '{en,formatUrl}' is null
    or value #>> '{en,formatUrl}' = ''
  );

update public.site_settings
set
  value = jsonb_set(
    jsonb_set(
      value,
      '{fr,platformUrl}',
      '"https://easychair.org/conferences/?conf=ianlp2026"'::jsonb,
      true
    ),
    '{fr,formatUrl}',
    '"https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"'::jsonb,
    true
  ),
  updated_at = now()
where key = 'submission'
  and (
    value #>> '{fr,platformUrl}' is null
    or value #>> '{fr,platformUrl}' = ''
    or value #>> '{fr,formatUrl}' is null
    or value #>> '{fr,formatUrl}' = ''
  );

update public.site_settings
set
  value = jsonb_set(
    jsonb_set(
      value,
      '{ar,platformUrl}',
      '"https://easychair.org/conferences/?conf=ianlp2026"'::jsonb,
      true
    ),
    '{ar,formatUrl}',
    '"https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"'::jsonb,
    true
  ),
  updated_at = now()
where key = 'submission'
  and (
    value #>> '{ar,platformUrl}' is null
    or value #>> '{ar,platformUrl}' = ''
    or value #>> '{ar,formatUrl}' is null
    or value #>> '{ar,formatUrl}' = ''
  );
