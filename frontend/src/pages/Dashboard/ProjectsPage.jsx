import { useState, useEffect } from 'react';
import { FiFolder, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit, FiArchive, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import ProjectFormModal from '../../components/dashboard/ProjectFormModal.jsx';
import { projectService } from '../../services/projectService.js';

const STATUS_COLORS = {
  'planning': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'completed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'archived': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      
      const response = await projectService.getProjects(params);
      setProjects(response.projects);
    } catch (error) {
      // Error fetching projects
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleArchiveProject = async (project) => {
    if (!confirm(`Archive "${project.title}"?`)) return;
    try {
      await projectService.archiveProject(project._id);
      fetchProjects();
    } catch (error) {
      // Error archiving project
    }
    setShowMenu(null);
  };

  const handleDeleteProject = async (project) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await projectService.deleteProject(project._id);
      fetchProjects();
    } catch (error) {
      // Error deleting project
    }
    setShowMenu(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleModalSuccess = () => {
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Every project you're building or open to join."
        action={
          <Button size="md" onClick={handleCreateProject}>
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            New Project
          </Button>
        }
      />

      <Card className="p-5 sm:p-6">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/35" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <FiFilter className="h-4 w-4 text-text/35" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FiFolder}
            title="No projects yet"
            description="Create your first project or browse open ones to join a team."
            action={<Button size="sm" onClick={handleCreateProject}>Create a project</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="relative rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/dashboard/projects/${project._id}`}>
                      <h3 className="font-display text-lg font-semibold text-text hover:text-primary dark:text-slate-100 dark:hover:text-primary">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-text/60 dark:text-slate-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === project._id ? null : project._id)}
                      className="rounded-lg p-1.5 text-text/40 transition-colors hover:bg-text/5 hover:text-text dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    >
                      <FiMoreVertical className="h-4 w-4" />
                    </button>
                    {showMenu === project._id && (
                      <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-border bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-text/5 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <FiEdit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchiveProject(project)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-text/5 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <FiArchive className="h-4 w-4" />
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary dark:bg-primary/10 dark:text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="rounded-full bg-text/5 px-2 py-0.5 text-[10px] font-medium text-text/60 dark:bg-slate-700 dark:text-slate-400">
                      +{project.stack.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Badge className={STATUS_COLORS[project.status]}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                  <span className="text-[10px] text-text/35 dark:text-slate-500">
                    {project.members.length} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        project={editingProject}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
