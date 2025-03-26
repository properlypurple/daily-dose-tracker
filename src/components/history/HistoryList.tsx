
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pill, Trash2, PlusCircle } from 'lucide-react';
import type { MedicationDose, Medication } from '@/types/medication';
import { deleteDose, addManualDose } from '@/utils/medicationUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HistoryListProps {
  doses: (MedicationDose & { medication: Medication })[];
  medications: Medication[];
  userId: string;
  onDoseChange: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ 
  doses, 
  medications, 
  userId, 
  onDoseChange 
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState('');
  const [takenDate, setTakenDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [takenTime, setTakenTime] = useState(format(new Date(), 'HH:mm'));
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (doseId: string) => {
    if (confirm('Are you sure you want to delete this dose record?')) {
      const success = await deleteDose(doseId);
      if (success) {
        onDoseChange();
      }
    }
  };

  const handleAddManualDose = async () => {
    if (!selectedMedicationId) {
      return;
    }

    setIsLoading(true);
    try {
      const takenAt = new Date(`${takenDate}T${takenTime}`).toISOString();
      const result = await addManualDose(selectedMedicationId, userId, takenAt);
      
      if (result) {
        setShowAddDialog(false);
        onDoseChange();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Medication History</h2>
        <Button onClick={() => setShowAddDialog(true)} className="button-hover">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Entry
        </Button>
      </div>

      {doses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No medication history yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doses.map((dose) => (
            <div 
              key={dose.id} 
              className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{dose.medication.name}</h3>
                  <p className="text-sm text-muted-foreground">{dose.medication.dosage}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(dose.taken_at), 'MMM d, yyyy - h:mm a')}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(dose.id)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Add Manual Dose</DialogTitle>
            <DialogDescription>
              Record a medication dose that was taken earlier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Select
                value={selectedMedicationId}
                onValueChange={setSelectedMedicationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((med) => (
                    <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={takenDate}
                onChange={(e) => setTakenDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={takenTime}
                onChange={(e) => setTakenTime(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddManualDose} 
              disabled={!selectedMedicationId || isLoading}
              className="button-hover"
            >
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryList;
