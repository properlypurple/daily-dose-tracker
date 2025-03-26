
export type Medication = {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  instructions?: string;
  created_at: string;
  updated_at: string;
  color?: string; // Adding the color property as optional
};

export type MedicationDose = {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  notes?: string;
  scheduled_time?: string;
  created_at: string;
  updated_at: string;
};
