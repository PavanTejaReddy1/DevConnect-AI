import { FiGithub, FiLinkedin, FiGlobe, FiMapPin, FiEdit2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text/40 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-text/80 dark:text-slate-200">{value || <span className="text-text/35 dark:text-slate-600">Not added yet</span>}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const links = [
    { icon: FiGithub, href: user?.github, label: 'GitHub' },
    { icon: FiLinkedin, href: user?.linkedin, label: 'LinkedIn' },
    { icon: FiGlobe, href: user?.portfolio, label: 'Portfolio' },
  ].filter((l) => l.href);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="How your teammates see you across DevConnect AI."
        action={
          <Button variant="secondary" size="md">
            <FiEdit2 className="h-4 w-4" aria-hidden="true" />
            Edit Profile
          </Button>
        }
      />

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar name={user?.name || '?'} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-text dark:text-white">{user?.name}</h2>
              <Badge tone={user?.availability === 'available' ? 'success' : 'neutral'}>
                {user?.availability || 'available'}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-text/55 dark:text-slate-400">{user?.email}</p>
            {user?.location && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-text/45 dark:text-slate-500">
                <FiMapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {user.location}
              </p>
            )}
            {links.length > 0 && (
              <div className="mt-3 flex gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text/50 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-400"
                  >
                    <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2 dark:border-white/10">
          <ProfileField label="Bio" value={user?.bio} />
          <ProfileField label="Experience" value={user?.experience} />
          <ProfileField label="Education" value={user?.education} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text/40 dark:text-slate-500">Skills</p>
            {user?.skills?.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {user.skills.map((skill) => (
                  <Badge key={skill} tone="primary">{skill}</Badge>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-text/35 dark:text-slate-600">Not added yet</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
