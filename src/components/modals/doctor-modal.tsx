import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Doctor } from '@/types';
import { useApp } from '@/contexts/app-context';

interface DoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
  mode: 'create' | 'edit';
}

export function DoctorModal({ open, onOpenChange, doctor, mode }: DoctorModalProps) {
  const { dispatch, addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    languages: [] as string[],
    insuranceAccepted: [] as string[],
    location: '',
    isAvailableForTelehealth: false,
    experience: 0,
    rating: 4.5,
  });

  useEffect(() => {
    if (mode === 'edit' && doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialties: doctor.specialties,
        languages: doctor.languages,
        insuranceAccepted: doctor.insuranceAccepted,
        location: doctor.location,
        isAvailableForTelehealth: doctor.isAvailableForTelehealth,
        experience: doctor.experience,
        rating: doctor.rating,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialties: [],
        languages: [],
        insuranceAccepted: [],
        location: '',
        isAvailableForTelehealth: false,
        experience: 0,
        rating: 4.5,
      });
    }
  }, [mode, doctor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        ...formData,
        availabilitySlots: [],
      };
      
      dispatch({ type: 'ADD_DOCTOR', payload: newDoctor });
      addNotification({
        title: 'Doctor Added',
        message: `Dr. ${formData.name} has been added successfully.`,
        type: 'success',
      });
    } else if (mode === 'edit' && doctor) {
      const updatedDoctor: Doctor = {
        ...doctor,
        ...formData,
      };
      
      dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });
      addNotification({
        title: 'Doctor Updated',
        message: `Dr. ${formData.name} has been updated successfully.`,
        type: 'success',
      });
    }
    
    onOpenChange(false);
  };

  const handleArrayChange = (field: 'specialties' | 'languages' | 'insuranceAccepted', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Add New Doctor' : 'Edit Doctor'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' 
                ? 'Add a new doctor to the system.' 
                : 'Update the doctor information.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Dr. John Smith"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
                placeholder="New York, NY"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Experience (Years)
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Specialties
              </Label>
              <div className="col-span-3 space-y-2">
                {['cardiology', 'neurology', 'orthopedics', 'endocrinology', 'dermatology'].map(specialty => (
                  <label key={specialty} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleArrayChange('specialties', specialty)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Languages
              </Label>
              <div className="col-span-3 space-y-2">
                {['English', 'Spanish', 'French', 'Portuguese', 'Mandarin'].map(language => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => handleArrayChange('languages', language)}
                      className="rounded"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Insurance
              </Label>
              <div className="col-span-3 space-y-2">
                {['BlueCross', 'Aetna', 'Cigna', 'Kaiser', 'UnitedHealth', 'Humana'].map(insurance => (
                  <label key={insurance} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.insuranceAccepted.includes(insurance)}
                      onChange={() => handleArrayChange('insuranceAccepted', insurance)}
                      className="rounded"
                    />
                    <span className="text-sm">{insurance}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Telehealth
              </Label>
              <div className="col-span-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailableForTelehealth}
                    onChange={(e) => setFormData({ ...formData, isAvailableForTelehealth: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Available for telehealth appointments</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Add Doctor' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}