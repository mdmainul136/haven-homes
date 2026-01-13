-- Enable pg_net extension for HTTP calls from cron
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the cron job to check valuation changes daily at 9 AM UTC
SELECT cron.schedule(
  'check-valuation-changes',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://lofzfrmwtlsugmlzbrfn.supabase.co/functions/v1/check-valuation-changes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);