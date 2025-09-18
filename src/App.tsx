import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/app-context';
import { Layout } from '@/components/layout/layout';
import { Dashboard } from '@/pages/dashboard';
import { Leads } from '@/pages/leads';
import { Doctors } from '@/pages/doctors';
import { Appointments } from '@/pages/appointments';
import { Analytics } from '@/pages/analytics';
import { Conditions } from '@/pages/conditions';
import { Patients } from '@/pages/patients';
import { Settings } from '@/pages/settings';
import { Toaster } from '@/components/ui/toast';

// Simple mock data for testing
const mockLeads = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    city: 'New York',
    symptoms: 'Severe headaches and nausea',
    preferredLanguage: 'English',
    source: 'Website',
    detectedConditions: ['migraine'],
    stage: 'new' as const,
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-18'),
  }
];

const mockDoctors = [
  {
    id: 'doctor1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medcenter.com',
    phone: '+1 (555) 123-4567',
    specialties: ['cardiology', 'internal-medicine'],
    languages: ['English', 'Spanish'],
    insuranceAccepted: ['BlueCross', 'Aetna', 'Cigna'],
    location: 'New York, NY',
    isAvailableForTelehealth: true,
    availabilitySlots: [],
    rating: 4.8,
    experience: 15,
  }
];

const mockAppointments = [
  {
    id: 'appt1',
    leadId: '1',
    doctorId: 'doctor1',
    slotId: 'slot1',
    date: new Date('2025-09-18T09:00:00'),
    status: 'scheduled' as const,
    notes: 'Initial consultation',
    followUpRequired: true,
    createdAt: new Date('2025-09-16'),
    updatedAt: new Date('2025-09-16'),
  }
];

const mockConditions = [
  {
    id: 'migraine',
    name: 'Migraine',
    description: 'Severe recurring headaches',
    keywords: ['headache', 'migraine', 'nausea'],
    specialtyId: 'neurology',
  }
];

function AppContent() {
  const { dispatch } = useApp();

  useEffect(() => {
    dispatch({ type: 'SET_LEADS', payload: mockLeads });
    dispatch({ type: 'SET_DOCTORS', payload: mockDoctors });
    dispatch({ type: 'SET_APPOINTMENTS', payload: mockAppointments });
    dispatch({ type: 'SET_CONDITIONS', payload: mockConditions });
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="conditions" element={<Conditions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<div className="p-8">Page not found</div>} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;