import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiUsers, FiClock, FiPlus, FiSearch } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary',
  onHold: 'bg-warning/10 text-warning',
  cancelled: 'bg-danger/10 text-danger',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/teams');
        // Use teams data as projects context until a dedicated projects endpoint is wired
        setProjects(res.data?.data?.teams || []);
      } catch {
        // Silently fall through — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 glass-card animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 glass-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="text-text/60 mt-1">Manage and track all your active projects</p>
        </div>
        <Link
          to="/teams/create"
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          New Project
        </Link>
      </motion.div>

      {/* Search */}
      <div className="glass-card flex items-center gap-3 p-4">
        <FiSearch className="h-5 w-5 shrink-0 text-text/40" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-text placeholder:text-text/35 focus:outline-none"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FiFolder className="mx-auto h-12 w-12 text-text/20" aria-hidden="true" />
          <p className="mt-4 font-semibold text-text">No projects yet</p>
          <p className="mt-1 text-sm text-text/50">Create a team to start your first project.</p>
          <Link to="/teams/create" className="btn-primary mt-6 inline-flex items-center gap-2">
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Link
                to={`/teams/${project._id}`}
                className="glass-card group block h-full rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <FiFolder className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {project.status && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[project.status] || 'bg-border text-text/60'}`}>
                      {project.status}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-text group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-text/55">{project.description}</p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-text/45">
                  {project.members && (
                    <span className="flex items-center gap-1.5">
                      <FiUsers className="h-3.5 w-3.5" aria-hidden="true" />
                      {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {project.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
