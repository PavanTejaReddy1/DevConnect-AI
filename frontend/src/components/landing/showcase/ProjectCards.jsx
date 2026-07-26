const PROJECTS = [
  { name: 'AI Recipe Planner', stack: 'React · Node.js · Gemini', status: 'Open', statusTone: 'bg-success/10 text-success', spots: '3 spots left' },
  { name: 'DevConnect Mobile', stack: 'React Native · Express', status: 'In Progress', statusTone: 'bg-primary/10 text-primary', spots: '5 members' },
  { name: 'OSS Analytics Hub', stack: 'Next.js · MongoDB', status: 'Open', statusTone: 'bg-success/10 text-success', spots: '2 spots left' },
];

/**
 * Compact project card grid used inside the "Overview" showcase tab.
 * Mirrors what a real Projects dashboard tile would show: stack, status, seats.
 */
export default function ProjectCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PROJECTS.map((project) => (
        <div key={project.name} className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${project.statusTone}`}>
              {project.status}
            </span>
            <span className="text-[10px] text-text/35">{project.spots}</span>
          </div>
          <p className="mt-3 font-display text-sm font-semibold text-text">{project.name}</p>
          <p className="mt-1 text-[11px] text-text/45">{project.stack}</p>
        </div>
      ))}
    </div>
  );
}
