
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type Medication = {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  color: string;
  created_at: string;
};

export type MedicationDose = {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  created_at: string;
};

// Error handling helper
export const handleError = (error: Error | unknown, message = 'An error occurred') => {
  console.error(error);
  toast.error(message);
  return null;
};

export default supabase;
