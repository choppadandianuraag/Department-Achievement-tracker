-- ============================================================================
-- Department Achievement Tracker — Supabase Setup
-- ============================================================================
-- Run this in your Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard → your project → SQL Editor → New Query
-- ============================================================================

-- CSV COLUMN MAPPING (rename Google Form headers before uploading):
-- ┌─────────────────────────────────────────────────────────┬───────────────────┐
-- │ Google Form CSV Header                                  │ DB Column Name    │
-- ├─────────────────────────────────────────────────────────┼───────────────────┤
-- │ Timestamp                                               │ submitted_at      │
-- │ Email Address                                           │ email             │
-- │ Student name                                            │ student_name      │
-- │ Hall ticket number                                      │ hall_ticket_number│
-- │ Currently studying                                      │ year              │
-- │ Stream/course                                           │ stream            │
-- │ Name of the award/ medal                                │ award_name        │
-- │ Team/Individual                                         │ team_type         │
-- │ Achievement level(Inter-university/State/National/Intl) │ achievement_level │
-- │ Name of the Event                                       │ event_name        │
-- │ Event date                                              │ date              │
-- │ Certificate of achievements                             │ certificate_link  │
-- │ Upload any image related to the Event                   │ event_image_link  │
-- └─────────────────────────────────────────────────────────┴───────────────────┘

-- 1. Create the achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at       TIMESTAMPTZ DEFAULT now(),  -- Timestamp
  email              TEXT NOT NULL,              -- Email Address
  student_name       TEXT NOT NULL,              -- Student name
  hall_ticket_number TEXT,                       -- Hall ticket number
  year               TEXT,                       -- Currently studying
  stream             TEXT,                       -- Stream/course
  award_name         TEXT,                       -- Name of the award / medal
  team_type          TEXT CHECK (team_type IN ('team', 'individual')), -- Team/Individual
  achievement_level  TEXT,                       -- Achievement level
  event_name         TEXT,                       -- Name of the Event
  date               DATE,                       -- Event date
  certificate_link   TEXT,                       -- Certificate of achievements
  event_image_link   TEXT,                       -- Upload any image related to the Event
  status             TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  academic_year      TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies — allow public access (the anon key is used by students)
CREATE POLICY "Allow public read"   ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON achievements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON achievements FOR DELETE USING (true);

-- ============================================================================
-- ALSO DO THIS MANUALLY IN THE SUPABASE DASHBOARD:
--
-- 1. Go to Storage → New Bucket
-- 2. Name: "achievement-uploads"
-- 3. Toggle "Public bucket" ON
-- 4. Go to Storage → Policies → achievement-uploads
-- 5. Add a policy that allows INSERT for the "anon" role
-- ============================================================================
