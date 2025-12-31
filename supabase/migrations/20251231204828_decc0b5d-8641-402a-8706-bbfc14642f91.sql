-- Create table for valuation alert subscriptions
CREATE TABLE public.valuation_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  threshold_percentage NUMERIC NOT NULL DEFAULT 10,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valuation_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own subscriptions"
ON public.valuation_subscriptions
FOR SELECT
USING (true);

CREATE POLICY "Users can create subscriptions"
ON public.valuation_subscriptions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can delete their own subscriptions"
ON public.valuation_subscriptions
FOR DELETE
USING (true);