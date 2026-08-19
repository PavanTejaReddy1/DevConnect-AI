export default function RoleBadge({ role }) {
  const roleStyles = {
    owner: 'bg-gradient-to-r from-primary to-accent text-white',
    admin: 'bg-primary/10 text-primary',
    member: 'bg-success/10 text-success',
    viewer: 'bg-gray-100 text-text/60',
  };

  const roleLabels = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    viewer: 'Viewer',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleStyles[role] || roleStyles.member}`}>
      {roleLabels[role] || role}
    </span>
  );
}
