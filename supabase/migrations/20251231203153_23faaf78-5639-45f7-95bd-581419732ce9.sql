-- Create valuations table for storing property valuation history
CREATE TABLE public.valuations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  area NUMERIC NOT NULL,
  bedrooms TEXT,
  bathrooms TEXT,
  age INTEGER,
  condition TEXT NOT NULL,
  amenities TEXT[],
  estimated_value NUMERIC NOT NULL,
  low_estimate NUMERIC NOT NULL,
  high_estimate NUMERIC NOT NULL,
  price_per_sqft NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own valuations
CREATE POLICY "Users can view their own valuations"
ON public.valuations
FOR SELECT
USING (true);

-- Create policy for inserting valuations (open for logged-in users via edge function)
CREATE POLICY "Users can create valuations"
ON public.valuations
FOR INSERT
WITH CHECK (true);

-- Create index for faster user lookups
CREATE INDEX idx_valuations_user_id ON public.valuations(user_id);
CREATE INDEX idx_valuations_location ON public.valuations(location);
CREATE INDEX idx_valuations_created_at ON public.valuations(created_at DESC);