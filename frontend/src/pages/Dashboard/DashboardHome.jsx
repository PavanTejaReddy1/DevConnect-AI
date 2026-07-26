import { useEffect, useState } from 'react';
import { FiFolder, FiUsers, FiCheckSquare, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import WeeklyActivityChart from '../../components/dashboard/WeeklyActivityChart.jsx';
import Card from '../../components/ui/Card.jsx';
import { SkeletonStatCard, SkeletonBlock } from '../../components/ui/Skeleton.jsx';
import Reveal from '../../components/common/Reveal.jsx';

// Reused directly from the landing page's product showcase rather than
// re-implemented, so the "logged in" dashboard renders identical widgets
// to what a visitor already saw in the marketing preview.
import ProjectCards from '../../components/landing/showcase/ProjectCards.jsx';
import TeamMembers from '../../components/landing/showcase/TeamMembers.jsx';
import ChatPreview from '../../components/landing/showcase/ChatPreview.jsx';

const STATS = [
  { icon: FiFolder, label: 'Active Projects', value: 3, tone: 'primary', trend: '+1' },
  { icon: FiUsers, label: 'Team Members', value: 9, tone: 'secondary', trend: '+2' },
  { icon: FiCheckSquare, label: 'Tasks Completed', value: 47, suffix: '', tone: 'success', trend: '+12%' },
  { icon: FiMessageSquare, label: 'Unread Messages', value: 5, tone: 'accent', trend: '-3' },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Stands in for a real GET /api/dashboard/summary call — the loading
  // skeleton below is genuinely driven by this state, not just decorative.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl dark:text-white">Welcome back, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-text/55 dark:text-slate-400">
            Here's what's happening across your projects today.
          </p>
        </div>
      </Reveal>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
          : STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.05}>
                <StatCard {...stat} />
              </Reveal>
            ))}
      </div>

      {/* Chart + Team snapshot */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Reveal delay={0.1}>
          {loading ? <SkeletonBlock className="h-80 w-full" /> : <WeeklyActivityChart />}
        </Reveal>

        <Reveal delay={0.15}>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text dark:text-white">Team snapshot</h3>
              <Link to="/dashboard/teams" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View all <FiArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="space-y-3">
                  <SkeletonBlock className="h-16 w-full" />
                  <SkeletonBlock className="h-16 w-full" />
                </div>
              ) : (
                <TeamMembers />
              )}
            </div>
          </Card>
        </Reveal>
      </div>

      {/* Recent projects + Chat preview */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Reveal delay={0.2}>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text dark:text-white">Recent projects</h3>
              <Link to="/dashboard/projects" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View all <FiArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <SkeletonBlock className="h-24 w-full" />
                  <SkeletonBlock className="h-24 w-full" />
                  <SkeletonBlock className="h-24 w-full" />
                </div>
              ) : (
                <ProjectCards />
              )}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.25}>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text dark:text-white">Recent messages</h3>
              <Link to="/dashboard/messages" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Open chat <FiArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-4">{loading ? <SkeletonBlock className="h-40 w-full" /> : <ChatPreview />}</div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
