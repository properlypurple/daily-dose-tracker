// Update History.tsx imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/utils/authUtils';
import { getAllDoses, getMedications } from '@/utils/medicationUtils';
import type { Medication, MedicationDose } from '@/types/medication';
import HistoryList from '@/components/history/HistoryList';

const History = () => {
  const [user, setUser] = useState(null);
  const [doses, setDoses] = useState([]);
  const [medications, setMedications] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        if (!userData) {
          navigate('/login');
          return;
        }

        setUser(userData);

        const dosesData = await getAllDoses(userData.id);
        setDoses(dosesData);

        const medicationsData = await getMedications(userData.id);
        setMedications(medicationsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDoseChange = async () => {
    if (user) {
      const dosesData = await getAllDoses(user.id);
      setDoses(dosesData);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading history...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      {user && (
        <HistoryList
          doses={doses}
          medications={medications}
          userId={user.id}
          onDoseChange={handleDoseChange}
        />
      )}
    </div>
  );
};

export default History;
