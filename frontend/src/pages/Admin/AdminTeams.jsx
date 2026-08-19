import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import TeamTable from '../../components/admin/TeamTable.jsx';
import toast from 'react-hot-toast';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [search]);

  const fetchTeams = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/admin/teams?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTeams(data.data.teams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (team) => {
    if (!confirm(`Are you sure you want to delete ${team.name}?`)) return;

    try {
      const response = await fetch(`/admin/teams/${team._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Team deleted successfully');
        fetchTeams();
      }
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Team Management</h1>
        <p className="text-text/60">Manage all platform teams</p>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative flex-1">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/70 text-text placeholder:text-text/40 text-sm"
          />
        </div>
      </div>

      {/* Teams Table */}
      <TeamTable
        teams={teams}
        onDelete={handleDelete}
      />
    </div>
  );
}
