import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiUsers, FiSettings, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import TeamHeader from '../../components/team/TeamHeader.jsx';
import TeamStats from '../../components/team/TeamStats.jsx';
import MemberList from '../../components/team/MemberList.jsx';
import InviteModal from '../../components/team/InviteModal.jsx';
import JoinRequestCard from '../../components/team/JoinRequestCard.jsx';
import TeamSettings from '../../components/team/TeamSettings.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [joinRequests, setJoinRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchTeam();
    fetchJoinRequests();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const response = await fetch(`/api/teams/${id}/requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setJoinRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
    }
  };

  const isOwner = team?.owner?._id === user?._id;
  const isAdmin = team?.admins?.some(admin => admin._id === user._id);
  const isMember = team?.members?.some(member => member._id === user._id);

  const handleInvite = async (receiverId, role, message) => {
    try {
      const response = await fetch(`/api/teams/${id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ receiverId, role, message }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Invitation sent successfully');
      } else {
        toast.error(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return;

    try {
      const response = await fetch(`/api/teams/${id}/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Left team successfully');
        navigate('/teams');
      } else {
        toast.error(data.message || 'Failed to leave team');
      }
    } catch (error) {
      toast.error('Failed to leave team');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`/api/teams/${id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Member removed successfully');
        fetchTeam();
      } else {
        toast.error(data.message || 'Failed to remove member');
      }
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/teams/${id}/requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Join request approved');
        fetchTeam();
        fetchJoinRequests();
      } else {
        toast.error(data.message || 'Failed to approve request');
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/teams/${id}/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Join request rejected');
        fetchJoinRequests();
      } else {
        toast.error(data.message || 'Failed to reject request');
      }
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleUpdateTeam = async (updateData) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setTeam(data.data);
      } else {
        throw new Error(data.message || 'Failed to update team');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        navigate('/teams');
      } else {
        throw new Error(data.message || 'Failed to delete team');
      }
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 glass-card animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 glass-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="glass-card p-12 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Team Not Found</h1>
        <p className="text-text/60 mb-6">The team you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <TeamHeader
        team={team}
        user={user}
        isOwner={isOwner}
        isAdmin={isAdmin}
        onLeave={handleLeaveTeam}
        onSettings={() => setShowSettings(true)}
      />

      {/* Team Stats */}
      <TeamStats team={team} />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'members'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text/60 hover:text-text'
          }`}
        >
          Members ({team.members?.length || 0})
        </button>
        {(isOwner || isAdmin) && (
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text/60 hover:text-text'
            }`}
          >
            Requests ({joinRequests.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0,y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Team Members</h2>
              {(isOwner || isAdmin) && (
                <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
                  <FiPlus size={18} />
                  Invite Member
                </Button>
              )}
            </div>
            <MemberList
              members={team.members}
              team={team}
              user={user}
              isOwner={isOwner}
              isAdmin={isAdmin}
              onRemove={handleRemoveMember}
            />
          </motion.div>
        )}

        {activeTab === 'requests' && (isOwner || isAdmin) && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-text mb-4">Join Requests</h2>
            {joinRequests.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-text/60">No pending join requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {joinRequests.map((request) => (
                  <JoinRequestCard
                    key={request._id}
                    request={request}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
        teamMembers={team.members?.map(m => m._id) || []}
      />

      {/* Settings Modal */}
      <TeamSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        team={team}
        onUpdate={handleUpdateTeam}
        onDelete={handleDeleteTeam}
      />
    </div>
  );
}
