-- Add workshop cover images
-- Safe to re-run

alter table public.workshops
  add column if not exists image_path text;

update public.workshops
set image_path = '/workshops/w1.jpg'
where sort_order = 0
  and (image_path is null or image_path = '');

update public.workshops
set image_path = '/workshops/w2.jpg'
where sort_order = 1
  and (image_path is null or image_path = '');
