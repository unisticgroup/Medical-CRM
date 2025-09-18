// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'doctor';
  avatar?: string;
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  symptoms: string;
  preferredLanguage: string;
  source: string;
  detectedConditions: string[];
  assignedAgent?: string;
  assignedDoctor?: string;
  stage: 'new' | 'contacted' | 'qualified' | 'booked' | 'attended' | 'treated' | 'closed' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

// Doctor Types
export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6, 0 = Sunday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isBooked: boolean;
  date?: Date; // For specific date slots
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  languages: string[];
  insuranceAccepted: string[];
  location: string;
  isAvailableForTelehealth: boolean;
  availabilitySlots: AvailabilitySlot[];
  rating: number;
  experience: number;
}

// Appointment Types
export interface Appointment {
  id: string;
  leadId: string;
  doctorId: string;
  slotId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  treatmentPlan?: string;
  followUpRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Condition Types
export interface Condition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  specialtyId: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  conditions: string[];
}

// Audit Types
export interface AuditLog {
  id: string;
  entityType: 'lead' | 'appointment' | 'doctor' | 'user';
  entityId: string;
  action: 'created' | 'updated' | 'deleted';
  changes: Record<string, any>;
  userId: string;
  timestamp: Date;
}

// Dashboard Types
export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  appointmentsToday: number;
  conversionRate: number;
  noShowRate: number;
  topConditions: { condition: string; count: number }[];
  leadsByStage: { stage: string; count: number }[];
  doctorUtilization: { doctorId: string; doctorName: string; utilization: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}