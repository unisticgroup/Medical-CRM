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
import type { Appointment } from '@/types';
import { useApp } from '@/contexts/app-context';

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  mode: 'create' | 'edit';
}

export function AppointmentModal({ open, onOpenChange, appointment, mode }: AppointmentModalProps) {
  const { state, dispatch, addNotification } = useApp();
  const [formData, setFormData] = useState({
    leadId: '',
    doctorId: '',
    date: '',
    time: '',
    status: 'scheduled' as Appointment['status'],
    notes: '',
    treatmentPlan: '',
    followUpRequired: false,
  });

  useEffect(() => {
    if (mode === 'edit' && appointment) {
      const appointmentDate = new Date(appointment.date);
      setFormData({
        leadId: appointment.leadId,
        doctorId: appointment.doctorId,
        date: appointmentDate.toISOString().split('T')[0],
        time: appointmentDate.toTimeString().slice(0, 5),
        status: appointment.status,
        notes: appointment.notes || '',
        treatmentPlan: appointment.treatmentPlan || '',
        followUpRequired: appointment.followUpRequired,
      });
    } else {
      setFormData({
        leadId: '',
        doctorId: '',
        date: '',
        time: '',
        status: 'scheduled',
        notes: '',
        treatmentPlan: '',
        followUpRequired: false,
      });
    }
  }, [mode, appointment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
    
    if (mode === 'create') {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        leadId: formData.leadId,
        doctorId: formData.doctorId,
        slotId: Date.now().toString(),
        date: appointmentDateTime,
        status: formData.status,
        notes: formData.notes,
        treatmentPlan: formData.treatmentPlan,
        followUpRequired: formData.followUpRequired,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      addNotification({
        title: 'Appointment Created',
        message: 'Appointment has been scheduled successfully.',
        type: 'success',
      });
    } else if (mode === 'edit' && appointment) {
      const updatedAppointment: Appointment = {
        ...appointment,
        leadId: formData.leadId,
        doctorId: formData.doctorId,
        date: appointmentDateTime,
        status: formData.status,
        notes: formData.notes,
        treatmentPlan: formData.treatmentPlan,
        followUpRequired: formData.followUpRequired,
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      addNotification({
        title: 'Appointment Updated',
        message: 'Appointment has been updated successfully.',
        type: 'success',
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Schedule New Appointment' : 'Edit Appointment'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' 
                ? 'Schedule a new patient appointment.' 
                : 'Update the appointment details.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <Select value={formData.leadId} onValueChange={(value) => setFormData({ ...formData, leadId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {state.leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <Select value={formData.doctorId} onValueChange={(value) => setFormData({ ...formData, doctorId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {state.doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialties.join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Appointment['status'] })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="col-span-3"
                placeholder="Appointment notes..."
              />
            </div>
            
            {mode === 'edit' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="treatmentPlan" className="text-right">
                  Treatment Plan
                </Label>
                <Input
                  id="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                  className="col-span-3"
                  placeholder="Treatment plan..."
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Follow-up
              </Label>
              <div className="col-span-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Follow-up required</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Schedule Appointment' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}