import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HelpRequest = {
  id: string;
  caller_name: string;
  caller_phone: string;
  question: string;
  status: 'pending' | 'resolved' | 'unresolved';
  supervisor_response: string | null;
  responded_at: string | null;
  created_at: string;
  expires_at: string;
};

export type KnowledgeBaseEntry = {
  id: string;
  question: string;
  answer: string;
  source_request_id: string | null;
  created_at: string;
  updated_at: string;
};
