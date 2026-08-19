import { motion } from 'framer-motion';
import { FiEdit2, FiMapPin, FiBriefcase } from 'react-icons/fi';

export default function ProfileCard({ user, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-card">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text">{user.name}</h3>
          <p className="text-sm text-text/50">@{user.username}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-text/60 mb-4 line-clamp-2">{user.bio}</p>
      )}

      {user.skills && user.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text/40 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-text/70 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-text/70 text-xs rounded-full">
                +{user.skills.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onEdit}
        className="w-full py-2 px-4 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        <FiEdit2 size={16} />
        Edit Profile
      </button>
    </motion.div>
  );
}
