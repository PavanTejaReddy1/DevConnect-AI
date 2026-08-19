import { motion } from 'framer-motion';
import { FiUsers, FiLock, FiGlobe, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import RoleBadge from './RoleBadge.jsx';

export default function TeamHeader({ team, user, isOwner, isAdmin, onLeave, onSettings }) {
  return (
    <div className="glass-card overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
        {team.banner ? (
          <img src={team.banner} alt="Banner" className="w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Team Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16">
          {/* Logo */}
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-card">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                team.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-text">{team.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {team.visibility === 'private' ? (
                  <FiLock size={16} className="text-text/40" />
                ) : (
                  <FiGlobe size={16} className="text-text/40" />
                )}
                <span className="text-sm text-text/40 capitalize">{team.visibility}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-sm text-text/60">
              <FiUsers size={16} />
              <span>{team.members?.length || 0} members</span>
            </div>
            {isOwner && (
              <button
                onClick={onSettings}
                className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <FiSettings size={20} />
              </button>
            )}
            {!isOwner && (
              <button
                onClick={onLeave}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Leave Team
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-text/60 mt-4">{team.description}</p>
        )}

        {/* Tech Stack */}
        {team.techStack && team.techStack.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-text/40 mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {team.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Owner */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
          <Avatar
            name={team.owner?.name}
            src={team.owner?.avatarUrl}
            size="md"
          />
          <div>
            <p className="text-sm text-text/40">Owned by</p>
            <Link to={`/u/${team.owner?.username}`} className="text-sm font-medium text-text hover:text-primary transition-colors">
              {team.owner?.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
