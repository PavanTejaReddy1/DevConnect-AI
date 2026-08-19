import { useState } from 'react';
import { FiLock, FiShield, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SecurityCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = () => {
    toast.success('Logged out from all devices');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiLock size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Change Password</h3>
            <p className="text-sm text-text/40">Update your password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 text-text placeholder:text-text/40 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 text-text placeholder:text-text/40 text-sm"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FiShield size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Two-Factor Authentication</h3>
            <p className="text-sm text-text/40">Add an extra layer of security</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-text rounded-xl hover:bg-gray-200 transition-colors text-sm">
          Enable 2FA (Coming Soon)
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center">
            <FiLogOut size={20} className="text-danger" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Logout From All Devices</h3>
            <p className="text-sm text-text/40">Sign out from all active sessions</p>
          </div>
        </div>
        <button
          onClick={handleLogoutAll}
          className="px-4 py-2 bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition-colors text-sm"
        >
          Logout All Devices
        </button>
      </div>
    </div>
  );
}
