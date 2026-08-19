import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import MemberCard from './MemberCard.jsx';
import RoleBadge from './RoleBadge.jsx';

export default function MemberList({ members, team, user, isOwner, isAdmin, onRemove }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredMembers = members?.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesRole;
  }) || [];

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={18} className="text-text/40" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-text/60">No members found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map((member, index) => {
            const memberRole = team.owner?._id === member._id ? 'owner' :
                              team.admins?.some(a => a._id === member._id) ? 'admin' : 'member';
            
            const canRemove = (isOwner || isAdmin) && memberRole !== 'owner' && member._id !== user._id;
            
            return (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <MemberCard
                  member={{ ...member, role: memberRole }}
                  team={team}
                  canRemove={canRemove}
                  onRemove={onRemove}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
