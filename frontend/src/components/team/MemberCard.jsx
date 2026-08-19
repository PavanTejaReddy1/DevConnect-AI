import { motion } from 'framer-motion';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import RoleBadge from './RoleBadge.jsx';

export default function MemberCard({ member, team, canRemove, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-4 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-center gap-4">
        <Avatar
          name={member.name}
          src={member.avatarUrl}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/u/${member.username}`} className="font-medium text-text hover:text-primary transition-colors">
              {member.name}
            </Link>
            <RoleBadge role={member.role || 'member'} />
          </div>
          <p className="text-sm text-text/50">@{member.username}</p>
          {member.skills && member.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {member.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-text/60 text-xs rounded-full"
                >
                  {typeof skill === 'object' ? skill.name : skill}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors">
            <FiMessageSquare size={18} />
          </button>
          {canRemove && (
            <button
              onClick={() => onRemove(member._id)}
              className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
