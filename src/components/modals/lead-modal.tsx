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
import type { Lead } from '@/types';
import { useApp } from '@/contexts/app-context';

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  mode: 'create' | 'edit';
}

export function LeadModal({ open, onOpenChange, lead, mode }: LeadModalProps) {
  const { dispatch, addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    symptoms: '',
    preferredLanguage: 'English',
    source: 'Website',
    stage: 'new' as Lead['stage'],
  });

  useEffect(() => {
    if (mode === 'edit' && lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        city: lead.city,
        symptoms: lead.symptoms,
        preferredLanguage: lead.preferredLanguage,
        source: lead.source,
        stage: lead.stage,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        symptoms: '',
        preferredLanguage: 'English',
        source: 'Website',
        stage: 'new',
      });
    }
  }, [mode, lead, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      const newLead: Lead = {
        id: Date.now().toString(),
        ...formData,
        detectedConditions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      addNotification({
        title: 'Lead Created',
        message: `Lead for ${formData.name} has been created successfully.`,
        type: 'success',
      });
    } else if (mode === 'edit' && lead) {
      const updatedLead: Lead = {
        ...lead,
        ...formData,
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'UPDATE_LEAD', payload: updatedLead });
      addNotification({
        title: 'Lead Updated',
        message: `Lead for ${formData.name} has been updated successfully.`,
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
              {mode === 'create' ? 'Add New Lead' : 'Edit Lead'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' 
                ? 'Create a new patient lead entry.' 
                : 'Update the lead information.'}
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
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symptoms" className="text-right">
                Symptoms
              </Label>
              <Input
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="col-span-3"
                placeholder="Describe symptoms..."
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                Language
              </Label>
              <Select
                value={formData.preferredLanguage}
                onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Mandarin">Mandarin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage" className="text-right">
                Stage
              </Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value as Lead['stage'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="treated">Treated</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Lead' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}