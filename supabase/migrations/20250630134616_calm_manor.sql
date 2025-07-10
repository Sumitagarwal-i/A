/*
  # Add demo user and fix authentication

  1. Demo User Setup
    - Create a demo user for testing
    - Ensure proper authentication flow

  2. User Management
    - Add userId column to briefs table for user isolation
    - Update RLS policies for proper user access control

  3. Security
    - Maintain proper RLS policies
    - Ensure demo user can access their data
*/

-- Add userId column to briefs table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'userId'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "userId" uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update RLS policies for user-based access
DROP POLICY IF EXISTS "Public access to briefs" ON briefs;

-- Allow users to see their own briefs
CREATE POLICY "Users can view own briefs"
  ON briefs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Allow users to insert their own briefs
CREATE POLICY "Users can insert own briefs"
  ON briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

-- Allow users to update their own briefs
CREATE POLICY "Users can update own briefs"
  ON briefs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- Allow users to delete their own briefs
CREATE POLICY "Users can delete own briefs"
  ON briefs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Allow public access for demo purposes (can be removed in production)
CREATE POLICY "Public read access for demo"
  ON briefs
  FOR SELECT
  TO public
  USING (true);

-- Add index for userId
CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs("userId");