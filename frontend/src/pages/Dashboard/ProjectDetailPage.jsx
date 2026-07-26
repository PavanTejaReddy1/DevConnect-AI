import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiMessageSquare, FiActivity, FiPaperclip, FiSend, FiUserPlus, FiDownload, FiTrash2, FiMoreVertical, FiEdit } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ProjectFormModal from '../../components/dashboard/ProjectFormModal.jsx';
import { projectService } from '../../services/projectService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const STATUS_COLORS = {
  'planning': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'completed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'archived': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjectById(id);
      setProject(response.project);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/dashboard/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    try {
      await projectService.joinProject(id);
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join project');
    }
  };

  const handleLeaveProject = async () => {
    if (!confirm('Are you sure you want to leave this project?')) return;
    try {
      await projectService.leaveProject(id);
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave project');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await projectService.addComment(id, comment);
      setComment('');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await projectService.deleteComment(id, commentId);
      fetchProject();
    } catch (error) {
      // Error deleting comment
    }
  };

  const handleInviteDeveloper = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await projectService.inviteDeveloper(id, inviteEmail);
      setInviteEmail('');
      alert('Invitation sent successfully!');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await projectService.uploadFile(id, file);
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file?')) return;
    try {
      await projectService.deleteFile(id, fileId);
      fetchProject();
    } catch (error) {
      // Error deleting file
    }
  };

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const isOwner = project?.owner?._id === user?.id;
  const isMember = project?.members?.some(m => m.user._id === user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-text/60">Project not found</p>
        <Link to="/dashboard/projects" className="mt-4 inline-block">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.title}
        subtitle={project.description}
        action={
          <div className="flex items-center gap-3">
            <Link to="/dashboard/projects">
              <Button variant="ghost" size="sm">
                <FiArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            {isOwner && (
              <Button size="sm" onClick={handleEditProject}>
                <FiEdit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        }
      />

      {/* Project Info Card */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={STATUS_COLORS[project.status]}>
                {project.status.replace('-', ' ')}
              </Badge>
              <span className="text-sm text-text/60 dark:text-slate-400">
                {project.members.length} / {project.maxMembers} members
              </span>
              {project.isPublic && (
                <span className="text-sm text-text/60 dark:text-slate-400">Public</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/10 dark:text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
            {(project.repository || project.demo) && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                {project.repository && (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Repository
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
          {!isMember && project.isPublic && (
            <Button onClick={handleJoinProject}>
              <FiUserPlus className="h-4 w-4" />
              Join Project
            </Button>
          )}
          {isMember && !isOwner && (
            <Button variant="secondary" onClick={handleLeaveProject}>
              Leave Project
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border dark:border-slate-700">
        {[
          { id: 'overview', label: 'Overview', icon: FiActivity },
          { id: 'comments', label: 'Comments', icon: FiMessageSquare },
          { id: 'members', label: 'Members', icon: FiUsers },
          { id: 'files', label: 'Files', icon: FiPaperclip },
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
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Activity Timeline */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Activity Timeline</h3>
            {project.activity?.length === 0 ? (
              <p className="text-sm text-text/60 dark:text-slate-400">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {project.activity.slice().reverse().map((item) => (
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

          {/* Invite Developers */}
          {isMember && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Invite Developers</h3>
              <form onSubmit={handleInviteDeveloper} className="flex gap-3">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                  className="flex-1"
                />
                <Button type="submit">
                  <FiUserPlus className="h-4 w-4" />
                  Invite
                </Button>
              </form>
              {project.invites?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-text dark:text-slate-200">Pending Invites</p>
                  <div className="space-y-2">
                    {project.invites.map((invite) => (
                      <div
                        key={invite._id}
                        className="flex items-center justify-between rounded-lg bg-text/5 px-3 py-2 dark:bg-slate-800"
                      >
                        <span className="text-sm text-text dark:text-slate-300">{invite.email}</span>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {invite.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Comments</h3>
          
          {isMember && (
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="input-field min-h-[80px] resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" size="sm">
                      <FiSend className="h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {project.comments?.length === 0 ? (
            <p className="text-sm text-text/60 dark:text-slate-400">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {project.comments.slice().reverse().map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Avatar name={comment.user?.name} src={comment.user?.avatarUrl} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text dark:text-slate-200">
                          {comment.user?.name}
                        </p>
                        <p className="mt-1 text-sm text-text dark:text-slate-300">{comment.content}</p>
                        <p className="mt-1 text-xs text-text/35 dark:text-slate-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {(comment.user._id === user?.id || isOwner) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-text/40 hover:text-danger dark:text-slate-500 dark:hover:text-danger"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'members' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Team Members</h3>
          <div className="space-y-3">
            {project.members.map((member) => (
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
                <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'files' && (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-text dark:text-slate-100">Files</h3>
          
          {isMember && (
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <Button as="span" size="sm">
                  <FiPaperclip className="h-4 w-4" />
                  Upload File
                </Button>
                <input type="file" onChange={handleFileUpload} className="hidden" />
                <span className="text-sm text-text/60 dark:text-slate-400">
                  Max file size: 10MB
                </span>
              </label>
            </div>
          )}

          {project.files?.length === 0 ? (
            <p className="text-sm text-text/60 dark:text-slate-400">No files uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {project.files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between rounded-lg bg-text/5 px-4 py-3 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <FiPaperclip className="h-4 w-4 text-text/40 dark:text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-text dark:text-slate-200">{file.name}</p>
                      <p className="text-xs text-text/60 dark:text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-text/40 transition-colors hover:text-primary dark:text-slate-500 dark:hover:text-primary"
                    >
                      <FiDownload className="h-4 w-4" />
                    </a>
                    {(file.uploadedBy._id === user?.id || isOwner) && (
                      <button
                        onClick={() => handleDeleteFile(file._id)}
                        className="rounded-lg p-2 text-text/40 transition-colors hover:text-danger dark:text-slate-500 dark:hover:text-danger"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchProject();
        }}
      />
    </div>
  );
}
