-- Drop existing policies with all possible name variations
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.valuation_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.valuation_subscriptions;

-- Recreate with proper user_id checks
CREATE POLICY "Subscriptions select own"
ON public.valuation_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Subscriptions insert own"
ON public.valuation_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Subscriptions delete own"
ON public.valuation_subscriptions
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Drop existing valuation policies
DROP POLICY IF EXISTS "Users can view their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can create their own valuations" ON public.valuations;
DROP POLICY IF EXISTS "Users can delete their own valuations" ON public.valuations;

-- Recreate with proper user_id checks
CREATE POLICY "Valuations select own"
ON public.valuations
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Valuations insert own"
ON public.valuations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Valuations delete own"
ON public.valuations
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);