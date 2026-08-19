import { motion } from 'framer-motion';
import { FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';

export default function ProfileHeader({ user, isOwnProfile = false, onEdit }) {
  const availabilityColors = {
    available: 'bg-success/10 text-success',
    busy: 'bg-warning/10 text-warning',
    unavailable: 'bg-danger/10 text-danger',
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16">
          {/* Avatar */}
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar
                name={user.name}
                src={user.avatarUrl}
                size="xl"
                className="border-4 border-card shadow-card"
              />
              {isOwnProfile && (
                <button
                  onClick={onEdit}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-card hover:bg-secondary transition-colors"
                >
                  <FiEdit2 size={14} />
                </button>
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-text">{user.name}</h1>
              <p className="text-text/60">@{user.username}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availabilityColors[user.availability]}`}>
              {user.availability}
            </span>
            {isOwnProfile && (
              <button
                onClick={onEdit}
                className="btn-primary px-4 py-2 text-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Bio & Location */}
        <div className="mt-4 space-y-2">
          {user.bio && (
            <p className="text-text/70">{user.bio}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-text/60">
            {user.location && (
              <div className="flex items-center gap-1">
                <FiMapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
              {user.role}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 mt-4">
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <FiGithub size={20} />
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <FiLinkedin size={20} />
            </a>
          )}
          {user.twitter && (
            <a
              href={user.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <FiTwitter size={20} />
            </a>
          )}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-gray-100 text-text/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <FiGlobe size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
