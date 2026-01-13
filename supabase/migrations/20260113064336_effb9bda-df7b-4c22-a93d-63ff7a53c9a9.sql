-- Drop the remaining overly permissive policies (without trailing spaces)
DROP POLICY IF EXISTS "Users can create subscriptions" ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can create valuations" ON public.valuations;