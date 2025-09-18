import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Download, Calendar, Clock, User, Phone, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import { AppointmentModal } from '@/components/modals/appointment-modal';
import { exportAppointmentsToCSV, exportToJSON } from '@/utils/export';

export function Appointments() {
  const { state, dispatch, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return state.appointments.filter(appointment => {
      const patient = state.leads.find(lead => lead.id === appointment.leadId);
      const doctor = state.doctors.find(doc => doc.id === appointment.doctorId);
      
      const matchesSearch = searchTerm === '' || 
        (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [state.appointments, state.leads, state.doctors, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    const todayAppointments = state.appointments.filter(apt => 
      apt.date.toDateString() === today.toDateString()
    );
    const completedToday = todayAppointments.filter(apt => apt.status === 'completed');
    const scheduledToday = todayAppointments.filter(apt => apt.status === 'scheduled');
    
    return [
      {
        title: 'Total Appointments',
        value: state.appointments.length.toString(),
        icon: Calendar,
        color: 'text-blue-600',
      },
      {
        title: 'Today\'s Appointments',
        value: todayAppointments.length.toString(),
        icon: Clock,
        color: 'text-green-600',
      },
      {
        title: 'Completed Today',
        value: completedToday.length.toString(),
        icon: User,
        color: 'text-purple-600',
      },
      {
        title: 'Scheduled Today',
        value: scheduledToday.length.toString(),
        icon: Phone,
        color: 'text-orange-600',
      },
    ];
  }, [state.appointments]);

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (appointment) => {
    const patient = state.leads.find(lead => lead.id === appointment.leadId);
    if (window.confirm(`Are you sure you want to cancel the appointment for ${patient?.name || 'Unknown Patient'}?`)) {
      dispatch({ type: 'DELETE_APPOINTMENT', payload: appointment.id });
      addNotification({
        title: 'Appointment Cancelled',
        message: `Appointment for ${patient?.name || 'Unknown Patient'} has been cancelled.`,
        type: 'success',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportAppointmentsToCSV(filteredAppointments);
      addNotification({
        title: 'Export Successful',
        message: 'Appointments have been exported to CSV successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export appointments to CSV.',
        type: 'error',
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(filteredAppointments, 'appointments-export');
      addNotification({
        title: 'Export Successful',
        message: 'Appointments have been exported to JSON successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export appointments to JSON.',
        type: 'error',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPatientName = (leadId) => {
    const patient = state.leads.find(lead => lead.id === leadId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = state.doctors.find(doc => doc.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage patient appointments and schedules.
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </div>
          <Button onClick={handleAddAppointment}>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          Showing {filteredAppointments.length} of {state.appointments.length} appointments
        </div>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>
            Complete list of patient appointments and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Doctor</th>
                  <th className="text-left p-4 font-medium">Date & Time</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Notes</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{getPatientName(appointment.leadId)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{getDoctorName(appointment.doctorId)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(appointment.date).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {appointment.notes || 'No notes'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            Appointments scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.appointments
              .filter(apt => apt.date.toDateString() === new Date().toDateString())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{getPatientName(appointment.leadId)}</div>
                    <div className="text-sm text-muted-foreground">
                      with {getDoctorName(appointment.doctorId)} • {' '}
                      {new Date(appointment.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {appointment.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            {state.appointments.filter(apt => apt.date.toDateString() === new Date().toDateString()).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No appointments scheduled for today
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AppointmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        appointment={selectedAppointment}
        mode={modalMode}
      />
    </div>
  );
}