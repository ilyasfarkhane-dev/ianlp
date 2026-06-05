-- Extend contact site_settings for Get in Touch section
-- Safe to re-run

insert into public.site_settings (key, value) values
  (
    'contact',
    '{
      "email": "omar.zahour@univh2c.ma",
      "phone": "+212660082091",
      "phoneDisplay": "+212 6 60 08 20 91",
      "address": "Faculty of Sciences Ben M''Sick (FSBM), Hassan II University of Casablanca, Bd Commandant Driss Al Harti, Casablanca 20670, Morocco",
      "generalChairName": "Prof. Omar Zahour",
      "chairAffiliationPrimary": "Faculty of Sciences Ben M''Sick (FSBM)",
      "chairAffiliationSecondary": "Hassan II University of Casablanca"
    }'::jsonb
  )
on conflict (key) do update set
  value = public.site_settings.value || excluded.value,
  updated_at = now();
