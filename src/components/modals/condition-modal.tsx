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
import type { Condition } from '@/types';
import { useApp } from '@/contexts/app-context';

interface ConditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condition?: Condition | null;
  mode: 'create' | 'edit';
}

export function ConditionModal({ open, onOpenChange, condition, mode }: ConditionModalProps) {
  const { dispatch, addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specialtyId: '',
    keywords: '',
  });

  useEffect(() => {
    if (mode === 'edit' && condition) {
      setFormData({
        name: condition.name,
        description: condition.description,
        specialtyId: condition.specialtyId,
        keywords: condition.keywords.join(', '),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        specialtyId: '',
        keywords: '',
      });
    }
  }, [mode, condition, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (mode === 'create') {
      const newCondition: Condition = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        specialtyId: formData.specialtyId,
        keywords: keywordsArray,
      };
      
      dispatch({ type: 'ADD_CONDITION', payload: newCondition });
      addNotification({
        title: 'Condition Added',
        message: `Condition "${formData.name}" has been added successfully.`,
        type: 'success',
      });
    } else if (mode === 'edit' && condition) {
      const updatedCondition: Condition = {
        ...condition,
        name: formData.name,
        description: formData.description,
        specialtyId: formData.specialtyId,
        keywords: keywordsArray,
      };
      
      dispatch({ type: 'UPDATE_CONDITION', payload: updatedCondition });
      addNotification({
        title: 'Condition Updated',
        message: `Condition "${formData.name}" has been updated successfully.`,
        type: 'success',
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Add New Condition' : 'Edit Condition'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' 
                ? 'Add a new medical condition to the system.' 
                : 'Update the condition information.'}
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
                placeholder="Migraine"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                placeholder="Condition description..."
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialty" className="text-right">
                Specialty
              </Label>
              <Select
                value={formData.specialtyId}
                onValueChange={(value) => setFormData({ ...formData, specialtyId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keywords" className="text-right">
                Keywords
              </Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="col-span-3"
                placeholder="headache, migraine, nausea"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Add Condition' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}