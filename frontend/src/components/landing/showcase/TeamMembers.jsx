const MEMBERS = [
  { name: 'Priya Nair', role: 'Frontend Lead', initials: 'PN', tone: 'from-primary to-accent', online: true },
  { name: 'Marcus Tan', role: 'Backend Engineer', initials: 'MT', tone: 'from-secondary to-primary', online: true },
  { name: 'Amara Okafor', role: 'ML Engineer', initials: 'AO', tone: 'from-accent to-secondary', online: false },
  { name: 'Jin Lee', role: 'Product Design', initials: 'JL', tone: 'from-primary to-secondary', online: true },
];

/** Team roster preview — mirrors the "View Team Members" module. */
export default function TeamMembers() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MEMBERS.map((member) => (
        <div key={member.name} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-sm">
          <span className="relative shrink-0">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${member.tone} text-[11px] font-semibold text-white`}
            >
              {member.initials}
            </span>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                member.online ? 'bg-success' : 'bg-text/25'
              }`}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-text">{member.name}</p>
            <p className="truncate text-[11px] text-text/45">{member.role}</p>
          </div>
          <span className="ml-auto shrink-0 text-[10px] font-medium text-text/35">
            {member.online ? 'Online' : 'Away'}
          </span>
        </div>
      ))}
    </div>
  );
}
