import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../ui/Card.jsx';

const DATA = [
  { day: 'Mon', tasks: 8, messages: 14 },
  { day: 'Tue', tasks: 14, messages: 22 },
  { day: 'Wed', tasks: 11, messages: 18 },
  { day: 'Thu', tasks: 19, messages: 27 },
  { day: 'Fri', tasks: 16, messages: 20 },
  { day: 'Sat', tasks: 9, messages: 11 },
  { day: 'Sun', tasks: 13, messages: 15 },
];

export default function WeeklyActivityChart() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-text dark:text-white">Weekly activity</h3>
          <p className="text-xs text-text/50 dark:text-slate-400">Tasks completed and messages sent</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-text/50 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Tasks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> Messages
          </span>
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#0F172A99' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#0F172A99' }} width={28} />
            <Tooltip
              cursor={{ fill: '#2563EB0D' }}
              contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}
            />
            <Bar dataKey="tasks" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="messages" fill="#38BDF8" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
