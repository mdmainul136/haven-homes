-- Drop the old policies with trailing spaces that still exist
DROP POLICY IF EXISTS "Users can create subscriptions " ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions " ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions " ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can create valuations " ON public.valuations;
DROP POLICY IF EXISTS "Users can delete their own valuations " ON public.valuations;
DROP POLICY IF EXISTS "Users can view their own valuations " ON public.valuations;