
import { supabase } from '@/integrations/supabase/client';
import type { Medication, MedicationDose } from '@/types/medication';
import { toast } from 'sonner';
import { handleError } from './authUtils';

// Get all medications for current user
export const getMedications = async (userId: string): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    
    return data as Medication[];
  } catch (error) {
    handleError(error, 'Failed to fetch medications');
    return [];
  }
};

// Add a new medication
export const addMedication = async (medicationData: Omit<Medication, 'id' | 'created_at' | 'updated_at'>): Promise<Medication | null> => {
  try {
    // Extract color from medication data since it's not a database column
    const { color, ...dbMedicationData } = medicationData;
    
    const { data, error } = await supabase
      .from('medications')
      .insert(dbMedicationData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the color back for the UI
    const result = { ...data, color } as Medication;
    
    toast.success(`Added ${medicationData.name}`);
    return result;
  } catch (error) {
    handleError(error, 'Failed to add medication');
    return null;
  }
};

// Update an existing medication
export const updateMedication = async (id: string, medication: Partial<Medication>): Promise<Medication | null> => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .update(medication)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Updated ${medication.name || 'medication'}`);
    return data as Medication;
  } catch (error) {
    handleError(error, 'Failed to update medication');
    return null;
  }
};

// Delete a medication
export const deleteMedication = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Medication deleted');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete medication');
    return false;
  }
};

// Check if the current time is within the medication's allowed time range
export const isWithinTimeRange = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  
  return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
};

// Record a medication dose
export const recordDose = async (medicationId: string, userId: string): Promise<MedicationDose | null> => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('doses') // Changed from medication_doses to doses based on Supabase schema
      .insert({
        medication_id: medicationId,
        user_id: userId,
        taken_at: now,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Dose recorded successfully');
    return data as MedicationDose;
  } catch (error) {
    handleError(error, 'Failed to record dose');
    return null;
  }
};

// Get dose history for a medication
export const getMedicationDoses = async (medicationId: string, userId: string): Promise<MedicationDose[]> => {
  try {
    const { data, error } = await supabase
      .from('doses')
      .select('*')
      .eq('medication_id', medicationId)
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
    
    if (error) throw error;
    
    return data as MedicationDose[];
  } catch (error) {
    handleError(error, 'Failed to fetch dose history');
    return [];
  }
};

// Get all doses for a user (for history page)
export const getAllDoses = async (userId: string): Promise<(MedicationDose & { medication: Medication })[]> => {
  try {
    const { data, error } = await supabase
      .from('doses')
      .select(`
        *,
        medication:medications(*)
      `)
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
    
    if (error) throw error;
    
    return data as (MedicationDose & { medication: Medication })[];
  } catch (error) {
    handleError(error, 'Failed to fetch dose history');
    return [];
  }
};

// Delete a dose record
export const deleteDose = async (doseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('doses')
      .delete()
      .eq('id', doseId);
    
    if (error) throw error;
    
    toast.success('Dose record deleted');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete dose record');
    return false;
  }
};

// Add a manual dose record
export const addManualDose = async (medicationId: string, userId: string, takenAt: string): Promise<MedicationDose | null> => {
  try {
    const { data, error } = await supabase
      .from('doses')
      .insert({
        medication_id: medicationId,
        user_id: userId,
        taken_at: takenAt,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Manual dose added successfully');
    return data as MedicationDose;
  } catch (error) {
    handleError(error, 'Failed to add manual dose');
    return null;
  }
};
