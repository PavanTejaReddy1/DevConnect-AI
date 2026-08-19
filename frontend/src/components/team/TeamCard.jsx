import { motion } from 'framer-motion';
import { FiUsers, FiLock, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';

export default function TeamCard({ team }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow group"
    >
      <Link to={`/teams/${team._id}`}>
        {/* Team Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-card">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              team.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors truncate">
              {team.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {team.visibility === 'private' ? (
                <FiLock size={14} className="text-text/40" />
              ) : (
                <FiGlobe size={14} className="text-text/40" />
              )}
              <span className="text-xs text-text/40 capitalize">{team.visibility}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-sm text-text/60 line-clamp-2 mb-4">{team.description}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-text/40">
          <div className="flex items-center gap-1">
            <FiUsers size={16} />
            <span>{team.members?.length || 0} members</span>
          </div>
          {team.skills && team.skills.length > 0 && (
            <div className="flex items-center gap-1">
              <span>{team.skills.length} skills</span>
            </div>
          )}
        </div>

        {/* Skills Preview */}
        {team.skills && team.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {team.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {team.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-text/60 text-xs rounded-full">
                +{team.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
