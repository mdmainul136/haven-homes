-- Add delete policy for valuations table
CREATE POLICY "Users can delete their own valuations"
ON public.valuations
FOR DELETE
USING (true);