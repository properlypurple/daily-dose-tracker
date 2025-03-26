
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { addMedication } from '@/utils/medicationUtils';
import { Medication } from '@/utils/supabase';
import { toast } from 'sonner';

interface AddMedicationFormProps {
  userId: string;
  onSuccess: (medication: Medication) => void;
  onCancel: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ userId, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dosage || !startTime || !endTime) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newMedication = await addMedication({
        user_id: userId,
        name,
        dosage,
        start_time: startTime,
        end_time: endTime,
        color,
      });
      
      if (newMedication) {
        onSuccess(newMedication);
        
        // Reset form
        setName('');
        setDosage('');
        setStartTime('08:00');
        setEndTime('22:00');
        setColor('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions = [
    { label: 'Blue', value: 'from-blue-50 to-blue-100 border-blue-200' },
    { label: 'Green', value: 'from-green-50 to-green-100 border-green-200' },
    { label: 'Purple', value: 'from-purple-50 to-purple-100 border-purple-200' },
    { label: 'Yellow', value: 'from-yellow-50 to-yellow-100 border-yellow-200' },
    { label: 'Pink', value: 'from-pink-50 to-pink-100 border-pink-200' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md border p-6 animate-in fade-in slide-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Medication</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Medication Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Aspirin, Vitamin D"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 100mg, 2 tablets"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Card Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  color === option.value ? 'border-primary scale-110' : 'border-transparent'
                } ${option.value.split(' ')[0]} ${option.value.split(' ')[1]}`}
                onClick={() => setColor(option.value)}
                title={option.label}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="button-hover"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Medication'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicationForm;
