
import React, { useState } from 'react';
import type { Medication } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Clock, Check, AlertTriangle } from 'lucide-react';
import { isWithinTimeRange, recordDose } from '@/utils/medicationUtils';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface MedicationCardProps {
  medication: Medication;
  onDoseRecorded: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onDoseRecorded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  
  const isWithinRange = isWithinTimeRange(medication.start_time, medication.end_time);
  
  const handleClick = async () => {
    if (!isWithinRange) {
      setShowWarning(true);
      return;
    }
    
    await recordDoseForMedication();
  };
  
  const recordDoseForMedication = async () => {
    setIsLoading(true);
    
    try {
      const result = await recordDose(medication.id, medication.user_id);
      if (result) {
        onDoseRecorded();
      }
    } finally {
      setIsLoading(false);
      setShowWarning(false);
    }
  };
  
  const formattedTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  const getBgColor = () => {
    if (medication.color) return medication.color;
    
    // Default color options if no color specified
    const colors = [
      'from-blue-50 to-blue-100 border-blue-200',
      'from-green-50 to-green-100 border-green-200',
      'from-purple-50 to-purple-100 border-purple-200',
      'from-yellow-50 to-yellow-100 border-yellow-200',
      'from-pink-50 to-pink-100 border-pink-200',
    ];
    
    // Use the medication id to pick a consistent color
    const colorIndex = medication.id.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <>
      <div 
        className={cn(
          "med-card card-animation min-h-[200px] min-w-[200px]",
          getBgColor(),
          isWithinRange && "med-card-active"
        )}
        onClick={handleClick}
      >
        <h3 className="text-xl font-semibold mb-2 text-center">{medication.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{medication.dosage}</p>
        
        <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span>{formattedTime(medication.start_time)} - {formattedTime(medication.end_time)}</span>
        </div>
        
        <Button 
          variant={isWithinRange ? "default" : "outline"} 
          size="sm"
          className={cn(
            "mt-2 button-hover",
            isWithinRange ? "bg-primary" : "bg-muted"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1 animate-spin" /> Recording...
            </span>
          ) : isWithinRange ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1" /> Take Now
            </span>
          ) : (
            <span className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" /> Outside Time
            </span>
          )}
        </Button>
      </div>
      
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Outside of scheduled time</AlertDialogTitle>
            <AlertDialogDescription>
              This medication is scheduled for {formattedTime(medication.start_time)} - {formattedTime(medication.end_time)}.
              Are you sure you want to record a dose now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={recordDoseForMedication}>
              Record Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicationCard;
