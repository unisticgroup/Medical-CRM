import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Calendar, UserPlus, Clock } from 'lucide-react';

const metrics = [
  {
    title: 'Total Leads',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: UserPlus,
  },
  {
    title: 'Conversion Rate',
    value: '73.2%',
    change: '+3.1%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Avg. Response Time',
    value: '4.2 min',
    change: '-15.3%',
    trend: 'up',
    icon: Clock,
  },
  {
    title: 'No-Show Rate',
    value: '8.5%',
    change: '+2.1%',
    trend: 'down',
    icon: TrendingDown,
  },
];

const topConditions = [
  { condition: 'Migraine', count: 234, percentage: 18.5 },
  { condition: 'Back Pain', count: 198, percentage: 15.6 },
  { condition: 'Diabetes', count: 176, percentage: 13.9 },
  { condition: 'Hypertension', count: 143, percentage: 11.3 },
  { condition: 'Arthritis', count: 127, percentage: 10.0 },
];

const leadSources = [
  { source: 'Website', count: 856, percentage: 30.1 },
  { source: 'WhatsApp', count: 623, percentage: 21.9 },
  { source: 'Phone Calls', count: 512, percentage: 18.0 },
  { source: 'Referrals', count: 445, percentage: 15.6 },
  { source: 'Social Media', count: 411, percentage: 14.4 },
];

const doctorPerformance = [
  { doctor: 'Dr. Sarah Johnson', appointments: 142, utilization: 95, rating: 4.8 },
  { doctor: 'Dr. Michael Chen', appointments: 138, utilization: 92, rating: 4.9 },
  { doctor: 'Dr. Emily Rodriguez', appointments: 125, utilization: 88, rating: 4.7 },
  { doctor: 'Dr. James Wilson', appointments: 119, utilization: 85, rating: 4.6 },
  { doctor: 'Dr. Lisa Brown', appointments: 116, utilization: 82, rating: 4.8 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and performance metrics for your medical practice.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs flex items-center ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Conditions</CardTitle>
            <CardDescription>
              Most common patient conditions this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topConditions.map((item, index) => (
              <div key={item.condition} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.condition}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.count} cases
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.percentage}%</div>
                  <div className="w-20 bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${item.percentage * 5}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>
              Where your patients are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadSources.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.source}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.count} leads
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.percentage}%</div>
                  <div className="w-20 bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${item.percentage * 3}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Doctor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance</CardTitle>
          <CardDescription>
            Monthly performance metrics for all doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Doctor</th>
                  <th className="text-left p-4 font-medium">Appointments</th>
                  <th className="text-left p-4 font-medium">Utilization</th>
                  <th className="text-left p-4 font-medium">Rating</th>
                  <th className="text-left p-4 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {doctorPerformance.map((doctor) => (
                  <tr key={doctor.doctor} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{doctor.doctor}</td>
                    <td className="p-4">{doctor.appointments}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${doctor.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm">{doctor.utilization}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">/5.0</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline Funnel</CardTitle>
          <CardDescription>
            Conversion rates through your sales pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: 'New Leads', count: 2847, percentage: 100 },
              { stage: 'Contacted', count: 2134, percentage: 75 },
              { stage: 'Qualified', count: 1707, percentage: 60 },
              { stage: 'Booked', count: 1138, percentage: 40 },
              { stage: 'Attended', count: 1024, percentage: 36 },
              { stage: 'Treated', count: 967, percentage: 34 },
            ].map((stage) => (
              <div key={stage.stage} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-primary h-4 rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm text-muted-foreground text-right">
                  {stage.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}