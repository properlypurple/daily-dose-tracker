
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import HistoryList from '@/components/history/HistoryList';
import { MedicationDose, Medication } from '@/utils/supabase';
import { getAllDoses, getMedications } from '@/utils/medicationUtils';
import { getUser } from '@/utils/authUtils';
import { toast } from 'sonner';

const History: React.FC = () => {
  const [doses, setDoses] = useState<(MedicationDose & { medication: Medication })[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const [dosesData, medsData] = await Promise.all([
        getAllDoses(userId),
        getMedications(userId)
      ]);
      
      setDoses(dosesData);
      setMedications(medsData);
    } catch (error) {
      toast.error('Failed to load history');
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
      fetchData();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userId && (
        <HistoryList 
          doses={doses} 
          medications={medications}
          userId={userId}
          onDoseChange={fetchData}
        />
      )}
    </div>
  );
};

export default History;
