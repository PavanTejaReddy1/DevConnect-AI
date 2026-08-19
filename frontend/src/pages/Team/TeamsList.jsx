import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import TeamCard from '../../components/team/TeamCard.jsx';
import Button from '../../components/ui/Button.jsx';

export default function TeamsList() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [searchQuery]);

  const fetchTeams = async () => {
    try {
      const url = searchQuery 
        ? `/api/teams?search=${encodeURIComponent(searchQuery)}`
        : '/api/teams';
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Teams</h1>
          <p className="text-text/60">Discover and join teams to collaborate on projects</p>
        </div>
        <Button onClick={() => navigate('/teams/create')} className="flex items-center gap-2">
          <FiPlus size={18} />
          Create Team
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
        <input
          type="text"
          placeholder="Search teams by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 glass-card animate-pulse" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-semibold text-text mb-2">No teams found</h2>
          <p className="text-text/60 mb-6">
            {searchQuery ? 'Try a different search term' : 'Create your first team to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate('/teams/create')}>
              Create Team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
