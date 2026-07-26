import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiUserPlus, FiActivity, FiCheck, FiX, FiTrash2, FiEdit, FiMoreVertical, FiBarChart2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import TeamFormModal from '../../components/dashboard/TeamFormModal.jsx';
import { teamService } from '../../services/teamService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_COLORS = {
  'owner': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'admin': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'member': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'accepted': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [joinMessage, setJoinMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await teamService.getTeamById(id);
      setTeam(response.team);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/dashboard/teams');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return;
    try {
      await teamService.leaveTeam(id);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave team');
    }
  };

  const handleRequestToJoin = async (e) => {
    e.preventDefault();
    try {
      await teamService.requestToJoin(id, joinMessage);
      setJoinMessage('');
      alert('Join request sent successfully!');
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send join request');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await teamService.inviteMember(id, inviteEmail, inviteRole);
      setInviteEmail('');
      alert('Invitation sent successfully!');
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await teamService.respondToJoinRequest(id, requestId, status);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to respond to request');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the team?')) return;
    try {
      await teamService.removeMember(id, memberId);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await teamService.updateMemberRole(id, memberId, newRole);
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleEditTeam = () => {
    setIsEditModalOpen(true);
  };

  const isOwner = team?.owner?._id === user?.id;
  const isAdmin = team?.members?.some(m => m.user._id === user?.id && (m.role === 'admin' || m.role === 'owner'));
  const isMember = team?.members?.some(m => m.user._id === user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-text/60">Team not found</p>
        <Link to="/dashboard/teams" className="mt-4 inline-block">
          <Button>Back to Teams</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={team.name}
        subtitle={team.description || 'No description'}
        action={
          <div className="flex items-center gap-3">
            <Link to="/dashboard/teams">
              <Button variant="ghost" size="sm">
                <FiArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            {isOwner && (
              <Button size="sm" onClick={handleEditTeam}>
                <FiEdit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        }
      />

      {/* Team Info Card */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-text/60 dark:text-slate-400">
                {team.members.length} members
              </span>
              {team.isPublic && (
                <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  Public
                </Badge>
              )}
              {team.tags.map((tag) => (
                <Badge key={tag} className="bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {!isMember && team.isPublic && (
            <form onSubmit={handleRequestToJoin} className="flex gap-3">
              <Input
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Add a message (optional)"
                className="flex-1"
              />
              <Button type="submit">
                <FiUserPlus className="h-4 w-4" />
                Request to Join
              </Button>
            </form>
          )}
          {isMember && !isOwner && (
            <Button variant="secondary" onClick={handleLeaveTeam}>
              Leave Team
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border dark:border-slate-700">
        {[
          { id: 'members', label: 'Members', icon: FiUsers },
          { id: 'requests', label: 'Join Requests', icon: FiUserPlus, count: team.joinRequests?.filter(r => r.status === 'pending').length },
          { id: 'activity', label: 'Activity', icon: FiActivity },
          { id: 'stats', label: 'Statistics', icon: FiBarChart2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-text/60 hover:text-text dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] text-white">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-text dark:text-slate-100">Team Members</h3>
            {isAdmin && (
              <form onSubmit={handleInviteMember} className="flex gap-2">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite by email"
                  type="email"
                  className="w-48"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button type="submit" size="sm">
                  <FiUserPlus className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-lg bg-text/5 px-4 py-3 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={member.user?.name} src={member.user?.avatarUrl} />
                  <div>
                    <p className="text-sm font-medium text-text dark:text-slate-200">
                      {member.user?.name}
                    </p>
                    <p className="text-xs text-text/60 dark:text-slate-400">{member.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={ROLE_COLORS[member.role]}>
                    {member.role}
                  </Badge>
                  {isOwner && member.role !== 'owner' && (
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.user._id, e.target.value)}
                      className="rounded border border-border bg-white px-2 py-1 text-xs text-text focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  )}
                  {isAdmin && member.role !== 'owner' && member.user._id !== user?.id && (
                    <button
                      onClick={() => handleRemoveMember(member.user._id)}
                      className="rounded-lg p-1.5 text-text/40 transition-colors hover:text-danger dark:text-slate-500 dark:hover:text-danger"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'requests' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Join Requests</h3>
          {team.joinRequests?.filter(r => r.status === 'pending').length === 0 ? (
            <p className="text-sm text-text/60 dark:text-slate-400">No pending join requests</p>
          ) : (
            <div className="space-y-3">
              {team.joinRequests
                .filter(r => r.status === 'pending')
                .map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between rounded-lg bg-text/5 px-4 py-3 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={request.user?.name} src={request.user?.avatarUrl} />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-slate-200">
                          {request.user?.name}
                        </p>
                        <p className="text-xs text-text/60 dark:text-slate-400">{request.user?.email}</p>
                        {request.message && (
                          <p className="mt-1 text-xs text-text/60 dark:text-slate-400 italic">
                            "{request.message}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRespondToRequest(request._id, 'rejected')}
                      >
                        <FiX className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRespondToRequest(request._id, 'accepted')}
                      >
                        <FiCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Activity Timeline</h3>
          {team.activity?.length === 0 ? (
            <p className="text-sm text-text/60 dark:text-slate-400">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {team.activity.slice().reverse().map((item) => (
                <div key={item._id} className="flex gap-3">
                  <Avatar name={item.user?.name} src={item.user?.avatarUrl} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm text-text dark:text-slate-200">
                      <span className="font-medium">{item.user?.name}</span>{' '}
                      <span className="text-text/60">{item.action}</span>
                    </p>
                    {item.description && (
                      <p className="text-sm text-text/60 dark:text-slate-400">{item.description}</p>
                    )}
                    <p className="mt-1 text-xs text-text/35 dark:text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'stats' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Team Statistics</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-text/5 p-4 dark:bg-slate-800">
              <p className="text-sm text-text/60 dark:text-slate-400">Projects Completed</p>
              <p className="mt-1 text-2xl font-semibold text-text dark:text-slate-100">
                {team.stats?.projectsCompleted || 0}
              </p>
            </div>
            <div className="rounded-lg bg-text/5 p-4 dark:bg-slate-800">
              <p className="text-sm text-text/60 dark:text-slate-400">Active Projects</p>
              <p className="mt-1 text-2xl font-semibold text-text dark:text-slate-100">
                {team.stats?.activeProjects || 0}
              </p>
            </div>
            <div className="rounded-lg bg-text/5 p-4 dark:bg-slate-800">
              <p className="text-sm text-text/60 dark:text-slate-400">Total Tasks</p>
              <p className="mt-1 text-2xl font-semibold text-text dark:text-slate-100">
                {team.stats?.totalTasks || 0}
              </p>
            </div>
            <div className="rounded-lg bg-text/5 p-4 dark:bg-slate-800">
              <p className="text-sm text-text/60 dark:text-slate-400">Completed Tasks</p>
              <p className="mt-1 text-2xl font-semibold text-text dark:text-slate-100">
                {team.stats?.completedTasks || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      <TeamFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={team}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchTeam();
        }}
      />
    </div>
  );
}
