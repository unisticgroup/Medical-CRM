import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, User, Calendar, FileText } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import type { Lead } from '@/types';

export function Patients() {
  const { state, dispatch, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Convert leads to patients (leads that have had appointments or are in later stages)
  const patients = useMemo(() => {
    return state.leads.filter(lead => 
      ['attended', 'treated', 'booked'].includes(lead.stage)
    );
  }, [state.leads]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [patients, searchTerm]);

  const getPatientAppointments = (patientId: string) => {
    return state.appointments.filter(apt => apt.leadId === patientId);
  };

  const handleViewDetails = (patient: Lead) => {
    addNotification({
      title: 'Patient Details',
      message: `Viewing details for ${patient.name}`,
      type: 'info',
    });
  };

  const handleScheduleAppointment = (patient: Lead) => {
    addNotification({
      title: 'Schedule Appointment',
      message: `Scheduling new appointment for ${patient.name}`,
      type: 'info',
    });
  };

  const getStageColor = (stage: string) => {
    const colors = {
      attended: 'bg-blue-100 text-blue-800',
      treated: 'bg-green-100 text-green-800',
      booked: 'bg-purple-100 text-purple-800',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and medical history.
          </p>
        </div>
        <Button onClick={() => handleScheduleAppointment({} as Lead)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active patient records
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treated Patients</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.stage === 'treated').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed treatments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.stage === 'booked').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming appointments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => {
          const appointments = getPatientAppointments(patient.id);
          const lastAppointment = appointments.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

          return (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStageColor(patient.stage)}`}>
                    {patient.stage}
                  </span>
                </div>
                <CardDescription>{patient.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">City:</span>
                    <p className="font-medium">{patient.city}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Language:</span>
                    <p className="font-medium">{patient.preferredLanguage}</p>
                  </div>
                </div>

                {lastAppointment && (
                  <div className="border-t pt-3">
                    <span className="text-sm text-muted-foreground">Last Appointment:</span>
                    <p className="text-sm font-medium">
                      {new Date(lastAppointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {lastAppointment.status}
                    </p>
                  </div>
                )}

                <div className="border-t pt-3">
                  <span className="text-sm text-muted-foreground">Symptoms:</span>
                  <p className="text-sm">{patient.symptoms}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(patient)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleScheduleAppointment(patient)}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredPatients.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No patients found matching your search criteria.
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patient Activity</CardTitle>
          <CardDescription>
            Latest updates and appointments for your patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.appointments
              .filter(apt => patients.some(p => p.id === apt.leadId))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((appointment) => {
                const patient = patients.find(p => p.id === appointment.leadId);
                const doctor = state.doctors.find(d => d.id === appointment.doctorId);
                
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{patient?.name || 'Unknown Patient'}</p>
                      <p className="text-sm text-muted-foreground">
                        with {doctor?.name || 'Unknown Doctor'} • {new Date(appointment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                );
              })}
            {state.appointments.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}