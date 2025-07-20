
-- Create outreach_sessions table to store conversation history
CREATE TABLE public.outreach_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  brief_id UUID REFERENCES public.briefs(id) NOT NULL,
  session_name TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only access their own sessions
ALTER TABLE public.outreach_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for outreach_sessions
CREATE POLICY "Users can view their own outreach sessions" 
  ON public.outreach_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outreach sessions" 
  ON public.outreach_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outreach sessions" 
  ON public.outreach_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outreach sessions" 
  ON public.outreach_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance when querying by user_id
CREATE INDEX idx_outreach_sessions_user_id ON public.outreach_sessions(user_id);

-- Create an index for better performance when querying by brief_id
CREATE INDEX idx_outreach_sessions_brief_id ON public.outreach_sessions(brief_id);
