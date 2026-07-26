import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const WEEKLY_DATA = [
  { day: 'Mon', tasks: 8 },
  { day: 'Tue', tasks: 14 },
  { day: 'Wed', tasks: 11 },
  { day: 'Thu', tasks: 19 },
  { day: 'Fri', tasks: 16 },
  { day: 'Sat', tasks: 9 },
  { day: 'Sun', tasks: 13 },
];

/**
 * Minimal area chart standing in for a real analytics widget — tasks
 * completed per day this week. Kept small and label-light to read as a
 * dashboard glance-card, not a full report.
 */
export default function AnalyticsChart() {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-text/70">Tasks completed this week</p>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">+22%</span>
      </div>
      <div className="mt-2 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={WEEKLY_DATA} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="taskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#0F172A99' }}
            />
            <Tooltip
              cursor={{ stroke: '#2563EB', strokeOpacity: 0.15 }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
            <Area type="monotone" dataKey="tasks" stroke="#2563EB" strokeWidth={2} fill="url(#taskFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
