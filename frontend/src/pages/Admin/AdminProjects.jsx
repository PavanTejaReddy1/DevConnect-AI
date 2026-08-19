import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import ProjectTable from '../../components/admin/ProjectTable.jsx';
import toast from 'react-hot-toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [search, status]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`/admin/projects?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete ${project.name}?`)) return;

    try {
      const response = await fetch(`/admin/projects/${project._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleArchive = async (project) => {
    try {
      const response = await fetch(`/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: !project.isActive }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Project ${project.isActive ? 'archived' : 'activated'} successfully`);
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  if (loading) {
    return <div className="h-96 glass-card animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Project Management</h1>
        <p className="text-text/60">Manage all platform projects</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/70 text-text placeholder:text-text/40 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-card/70 text-text text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Projects Table */}
      <ProjectTable
        projects={projects}
        onDelete={handleDelete}
        onArchive={handleArchive}
      />
    </div>
  );
}
