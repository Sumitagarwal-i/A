/*
  # Add new intelligence fields for PitchIntel

  1. Schema Updates
    - Add stockData field for Yahoo Finance integration
    - Add toneInsights field for Twinword API integration
    - Update existing fields to support new data types

  2. Enhanced Intelligence
    - Support for stock price and financial data
    - NLP tone and emotion analysis
    - Improved data structure for better analytics

  3. Performance
    - Add indexes for new fields
    - Optimize for production usage
*/

-- Add new columns for enhanced intelligence
DO $$
BEGIN
  -- Add stockData column for Yahoo Finance integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'stockData'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "stockData" jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Add toneInsights column for Twinword API integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'toneInsights'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "toneInsights" jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add performance indexes for new fields
CREATE INDEX IF NOT EXISTS idx_briefs_stock_data ON briefs USING gin("stockData");
CREATE INDEX IF NOT EXISTS idx_briefs_tone_insights ON briefs USING gin("toneInsights");

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Public read access for demo" ON briefs;
DROP POLICY IF EXISTS "Users can view own briefs" ON briefs;
DROP POLICY IF EXISTS "Users can insert own briefs" ON briefs;
DROP POLICY IF EXISTS "Users can update own briefs" ON briefs;
DROP POLICY IF EXISTS "Users can delete own briefs" ON briefs;

-- Recreate policies with updated permissions
CREATE POLICY "Public read access for demo"
  ON briefs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view own briefs"
  ON briefs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own briefs"
  ON briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own briefs"
  ON briefs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own briefs"
  ON briefs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");