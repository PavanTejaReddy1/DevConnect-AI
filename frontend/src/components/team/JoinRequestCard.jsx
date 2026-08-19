import { motion } from 'framer-motion';
import { FiUser, FiCheck, FiX } from 'react-icons/fi';
import Avatar from '../ui/Avatar.jsx';

export default function JoinRequestCard({ request, onApprove, onReject }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-4 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start gap-4">
        <Avatar
          name={request.user?.name}
          src={request.user?.avatarUrl}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-text">{request.user?.name}</h3>
            <span className="text-xs text-text/40">{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-text/50">@{request.user?.username}</p>
          {request.message && (
            <p className="text-sm text-text/60 mt-2 line-clamp-2">{request.message}</p>
          )}
          {request.user?.skills && request.user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {request.user.skills.slice(0, 3).map((skill, index) => (
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
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(request._id)}
            className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
            title="Approve"
          >
            <FiCheck size={18} />
          </button>
          <button
            onClick={() => onReject(request._id)}
            className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
            title="Reject"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
