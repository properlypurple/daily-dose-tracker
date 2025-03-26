
import { createClient } from '@supabase/supabase-js';
import type { User } from '@/types/auth';
import { toast } from 'sonner';
import type { Medication, MedicationDose } from '@/types/medication';

const supabaseUrl = 'https://uobiniyocextyhtfrvfi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYmluaXlvY2V4dHlodGZydmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDQ4NjEsImV4cCI6MjA1ODUyMDg2MX0.bys-HmQr4CcevCFGPjiAwjUDD0IHMPKPFq5UM4XqsYg';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Handle errors
export const handleError = (error: any, fallbackMessage: string = 'An error occurred') => {
  console.error('Error:', error);
  const message = error?.message || fallbackMessage;
  toast.error(message);
};

// Export types
export type { User, Medication, MedicationDose };
