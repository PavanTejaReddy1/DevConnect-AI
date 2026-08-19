import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Avatar from '../ui/Avatar.jsx';

export default function InviteModal({ isOpen, onClose, onInvite, teamMembers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock users - will be replaced with actual API call
  const mockUsers = [
    { _id: '1', name: 'John Doe', username: 'johndoe', avatarUrl: '', skills: ['React', 'Node.js'] },
    { _id: '2', name: 'Jane Smith', username: 'janesmith', avatarUrl: '', skills: ['Python', 'Machine Learning'] },
    { _id: '3', name: 'Bob Johnson', username: 'bobjohnson', avatarUrl: '', skills: ['Vue.js', 'TypeScript'] },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      !teamMembers?.includes(user._id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInvite = async () => {
    if (!selectedUser) return;
    setLoading(true);
    await onInvite(selectedUser._id, role, message);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUser(null);
    setRole('member');
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Invite Member</h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-text/40 py-4">No users found</p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        selectedUser?._id === user._id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Avatar name={user.name} src={user.avatarUrl} size="md" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-text">{user.name}</p>
                        <p className="text-sm text-text/50">@{user.username}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Role Selection */}
              {selectedUser && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              )}

              {/* Message */}
              {selectedUser && (
                <div className="mb-4">
                  <Input
                    label="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    textarea
                    rows={2}
                    maxLength={300}
                    placeholder="Add a personal message..."
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleInvite}
                  disabled={!selectedUser || loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Invite'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
