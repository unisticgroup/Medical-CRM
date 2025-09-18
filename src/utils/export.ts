import type { Lead, Doctor, Appointment, Condition } from '@/types';

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>
) {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Use provided columns or infer from first object
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));
  
  // Create CSV headers
  const headers = cols.map(col => col.label).join(',');
  
  // Create CSV rows
  const rows = data.map(item => 
    cols.map(col => {
      const value = item[col.key];
      // Handle nested objects, dates, and arrays
      let csvValue = '';
      if (value === null || value === undefined) {
        csvValue = '';
      } else if (value instanceof Date) {
        csvValue = value.toISOString().split('T')[0];
      } else if (Array.isArray(value)) {
        csvValue = value.join('; ');
      } else if (typeof value === 'object') {
        csvValue = JSON.stringify(value);
      } else {
        csvValue = String(value);
      }
      
      // Escape quotes and wrap in quotes if contains comma
      if (csvValue.includes(',') || csvValue.includes('"') || csvValue.includes('\n')) {
        csvValue = `"${csvValue.replace(/"/g, '""')}"`;
      }
      
      return csvValue;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportLeadsToCSV(leads: Lead[]) {
  const columns = [
    { key: 'name' as keyof Lead, label: 'Name' },
    { key: 'email' as keyof Lead, label: 'Email' },
    { key: 'phone' as keyof Lead, label: 'Phone' },
    { key: 'city' as keyof Lead, label: 'City' },
    { key: 'symptoms' as keyof Lead, label: 'Symptoms' },
    { key: 'preferredLanguage' as keyof Lead, label: 'Language' },
    { key: 'source' as keyof Lead, label: 'Source' },
    { key: 'stage' as keyof Lead, label: 'Stage' },
    { key: 'detectedConditions' as keyof Lead, label: 'Conditions' },
    { key: 'createdAt' as keyof Lead, label: 'Created Date' },
  ];
  
  exportToCSV(leads, 'leads-export', columns);
}

export function exportDoctorsToCSV(doctors: Doctor[]) {
  const columns = [
    { key: 'name' as keyof Doctor, label: 'Name' },
    { key: 'email' as keyof Doctor, label: 'Email' },
    { key: 'phone' as keyof Doctor, label: 'Phone' },
    { key: 'specialties' as keyof Doctor, label: 'Specialties' },
    { key: 'languages' as keyof Doctor, label: 'Languages' },
    { key: 'location' as keyof Doctor, label: 'Location' },
    { key: 'experience' as keyof Doctor, label: 'Experience (Years)' },
    { key: 'rating' as keyof Doctor, label: 'Rating' },
    { key: 'isAvailableForTelehealth' as keyof Doctor, label: 'Telehealth Available' },
    { key: 'insuranceAccepted' as keyof Doctor, label: 'Insurance Accepted' },
  ];
  
  exportToCSV(doctors, 'doctors-export', columns);
}

export function exportAppointmentsToCSV(appointments: Appointment[]) {
  const columns = [
    { key: 'leadId' as keyof Appointment, label: 'Patient ID' },
    { key: 'doctorId' as keyof Appointment, label: 'Doctor ID' },
    { key: 'date' as keyof Appointment, label: 'Date' },
    { key: 'status' as keyof Appointment, label: 'Status' },
    { key: 'notes' as keyof Appointment, label: 'Notes' },
    { key: 'treatmentPlan' as keyof Appointment, label: 'Treatment Plan' },
    { key: 'followUpRequired' as keyof Appointment, label: 'Follow-up Required' },
    { key: 'createdAt' as keyof Appointment, label: 'Created Date' },
  ];
  
  exportToCSV(appointments, 'appointments-export', columns);
}

export function exportConditionsToCSV(conditions: Condition[]) {
  const columns = [
    { key: 'name' as keyof Condition, label: 'Condition' },
    { key: 'description' as keyof Condition, label: 'Description' },
    { key: 'specialtyId' as keyof Condition, label: 'Specialty' },
    { key: 'keywords' as keyof Condition, label: 'Keywords' },
  ];
  
  exportToCSV(conditions, 'conditions-export', columns);
}

export function exportToJSON<T>(data: T[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}