-- Create certificates table for storing generated certificate credentials
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_id TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  course_name TEXT,
  organization_name TEXT,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  template_name TEXT,
  qr_code_data TEXT,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on credential_id for fast lookups
CREATE INDEX idx_certificates_credential_id ON public.certificates(credential_id);
CREATE INDEX idx_certificates_recipient_name ON public.certificates(recipient_name);

-- Enable RLS but allow public read for verification
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to verify certificates (public read)
CREATE POLICY "Anyone can verify certificates" 
  ON public.certificates 
  FOR SELECT 
  USING (true);

-- Allow inserts from the application (for bulk generation)
CREATE POLICY "Allow certificate creation" 
  ON public.certificates 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_certificates_updated_at();