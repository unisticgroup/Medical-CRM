import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/app-context';

export function Dashboard() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const today = new Date();
    const todayAppointments = state.appointments.filter(apt => 
      apt.date.toDateString() === today.toDateString()
    );
    const completedAppointments = state.appointments.filter(apt => apt.status === 'completed');
    const totalLeads = state.leads.length;
    const conversionRate = totalLeads > 0 ? (completedAppointments.length / totalLeads * 100).toFixed(0) : 0;

    return [
      {
        title: 'Total Leads',
        value: totalLeads.toString(),
        change: '+12%',
        icon: UserPlus,
        color: 'text-blue-600',
      },
      {
        title: 'Total Doctors',
        value: state.doctors.length.toString(),
        change: '+5%',
        icon: Users,
        color: 'text-green-600',
      },
      {
        title: 'Appointments Today',
        value: todayAppointments.length.toString(),
        change: '+8%',
        icon: Calendar,
        color: 'text-orange-600',
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        change: '+3%',
        icon: TrendingUp,
        color: 'text-purple-600',
      },
    ];
  }, [state]);

  const recentLeads = useMemo(() => {
    return state.leads
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [state.leads]);

  const todayAppointments = useMemo(() => {
    const today = new Date();
    return state.appointments
      .filter(apt => apt.date.toDateString() === today.toDateString())
      .slice(0, 3);
  }, [state.appointments]);

  const getDoctorName = (doctorId: string) => {
    const doctor = state.doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getPatientName = (leadId: string) => {
    const lead = state.leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Unknown Patient';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your medical practice today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Latest patient inquiries and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {lead.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lead.symptoms}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lead.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.stage === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.stage === 'qualified' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.stage}
                    </span>
                  </div>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent leads</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {getDoctorName(appointment.doctorId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getPatientName(appointment.leadId)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground">No appointments today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}