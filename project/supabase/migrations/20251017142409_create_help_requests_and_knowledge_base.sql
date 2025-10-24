/*
  # Human-in-the-Loop AI Supervisor Schema

  ## Overview
  This migration creates the core tables for managing AI agent escalations and knowledge base updates.

  ## New Tables
  
  ### `help_requests`
  Stores escalation requests when the AI agent doesn't know an answer.
  - `id` (uuid, primary key) - Unique identifier for each request
  - `caller_name` (text) - Name of the caller who asked the question
  - `caller_phone` (text) - Phone number for callback
  - `question` (text) - The question that needs answering
  - `status` (text) - Lifecycle: 'pending', 'resolved', 'unresolved'
  - `supervisor_response` (text, nullable) - Answer provided by supervisor
  - `responded_at` (timestamptz, nullable) - When supervisor responded
  - `created_at` (timestamptz) - When request was created
  - `expires_at` (timestamptz) - When request times out (24 hours default)

  ### `knowledge_base`
  Stores learned answers from supervisor responses for future use.
  - `id` (uuid, primary key) - Unique identifier
  - `question` (text) - The question (normalized)
  - `answer` (text) - The learned answer
  - `source_request_id` (uuid, nullable) - Links to originating help request
  - `created_at` (timestamptz) - When this was learned
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - For this demo, we'll allow public access since there's no auth yet
  - In production, these would be restricted to authenticated supervisors

  ## Indexes
  - Index on help_requests.status for fast filtering
  - Index on help_requests.expires_at for timeout processing
  - Index on knowledge_base.question for fast lookups
*/

-- Create help_requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_name text NOT NULL,
  caller_phone text NOT NULL,
  question text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'unresolved')),
  supervisor_response text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  source_request_id uuid REFERENCES help_requests(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_expires_at ON help_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_question ON knowledge_base(question);

-- Enable RLS
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes (no auth implemented yet)
CREATE POLICY "Allow public read access to help_requests"
  ON help_requests FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to help_requests"
  ON help_requests FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to help_requests"
  ON help_requests FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to knowledge_base"
  ON knowledge_base FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to knowledge_base"
  ON knowledge_base FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to knowledge_base"
  ON knowledge_base FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);