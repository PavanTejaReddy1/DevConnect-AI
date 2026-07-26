import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiSearch, FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import TeamFormModal from '../../components/dashboard/TeamFormModal.jsx';
import { teamService } from '../../services/teamService.js';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, [searchQuery]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await teamService.getTeams(params);
      setTeams(response.teams);
    } catch (error) {
      // Error fetching teams
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDeleteTeam = async (team) => {
    if (!confirm(`Delete "${team.name}"? This cannot be undone.`)) return;
    try {
      await teamService.deleteTeam(team._id);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete team');
    }
    setShowMenu(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleModalSuccess = () => {
    fetchTeams();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        subtitle="Members you're currently building with."
        action={
          <Button size="md" onClick={handleCreateTeam}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            New Team
          </Button>
        }
      />

      <Card className="p-5 sm:p-6">
        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/35" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : teams.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No teams yet"
            description="Create your first team or join existing ones to collaborate."
            action={<Button size="sm" onClick={handleCreateTeam}>Create a team</Button>}
          />
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 4).map((member) => (
                      <Avatar
                        key={member.user._id}
                        name={member.user.name}
                        src={member.user.avatarUrl}
                        size="sm"
                        className="border-2 border-white dark:border-slate-800"
                      />
                    ))}
                    {team.members.length > 4 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-text/10 text-xs font-medium text-text dark:border-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        +{team.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div>
                    <Link to={`/dashboard/teams/${team._id}`}>
                      <h3 className="font-display text-lg font-semibold text-text hover:text-primary dark:text-slate-100 dark:hover:text-primary">
                        {team.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-text/60 dark:text-slate-400">
                      {team.members.length} members
                      {team.isPublic && ' · Public'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {team.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                      {tag}
                    </Badge>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === team._id ? null : team._id)}
                      className="rounded-lg p-1.5 text-text/40 transition-colors hover:bg-text/5 hover:text-text dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    >
                      <FiMoreVertical className="h-4 w-4" />
                    </button>
                    {showMenu === team._id && (
                      <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-border bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-text/5 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <FiEdit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <TeamFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        team={editingTeam}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
