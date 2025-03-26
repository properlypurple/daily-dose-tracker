
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import MedicationCard from '@/components/medications/MedicationCard';
import AddMedicationForm from '@/components/medications/AddMedicationForm';
import { Medication } from '@/utils/supabase';
import { getMedications } from '@/utils/medicationUtils';
import { getUser } from '@/utils/authUtils';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMedications = async () => {
    if (!userId) return;
    
    try {
      const meds = await getMedications(userId);
      setMedications(meds);
    } catch (error) {
      toast.error('Failed to load medications');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMedications();
    }
  }, [userId]);

  const handleMedicationAdded = (medication: Medication) => {
    setMedications((prevMeds) => [...prevMeds, medication]);
    setShowAddForm(false);
    toast.success(`${medication.name} added to your medications`);
  };

  const handleDoseRecorded = () => {
    // Refetch medications to get updated state
    fetchMedications();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Medications</h1>
          <p className="text-muted-foreground mt-1">
            Click on a medication to record a dose
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="button-hover"
        >
          {showAddForm ? 'Cancel' : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </>
          )}
        </Button>
      </div>

      {showAddForm && userId && (
        <AddMedicationForm 
          userId={userId} 
          onSuccess={handleMedicationAdded} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {medications.length === 0 && !showAddForm ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">No medications added yet</p>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="button-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Medication
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((medication) => (
            <MedicationCard 
              key={medication.id} 
              medication={medication} 
              onDoseRecorded={handleDoseRecorded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
