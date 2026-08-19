import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiCopy, FiTrash2, FiEdit2, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import Checklist from './Checklist.jsx';
import CommentSection from './CommentSection.jsx';
import toast from 'react-hot-toast';

export default function TaskDetailsDrawer({ isOpen, onClose, task, onUpdate, onDelete, onDuplicate }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && task?._id) {
      fetchComments();
    }
  }, [isOpen, task?._id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (content) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([...comments, data.data]);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        setComments(comments.map(c => c._id === commentId ? data.data : c));
      }
    } catch (error) {
      toast.error('Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleChecklistToggle = async (itemId) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    try {
      const response = await fetch(`/api/tasks/${task._id}/checklist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ checklist: updatedChecklist }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.data);
      }
    } catch (error) {
      toast.error('Failed to update checklist');
    }
  };

  const handleAddChecklistItem = (text) => {
    const newItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    const updatedChecklist = [...(task.checklist || []), newItem];

    fetch(`/api/tasks/${task._id}/checklist`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ checklist: updatedChecklist }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdate(data.data);
        }
      })
      .catch(() => toast.error('Failed to add checklist item'));
  };

  const handleRemoveChecklistItem = (itemId) => {
    const updatedChecklist = task.checklist.filter(item => item.id !== itemId);

    fetch(`/api/tasks/${task._id}/checklist`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ checklist: updatedChecklist }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdate(data.data);
        }
      })
      .catch(() => toast.error('Failed to remove checklist item'));
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete();
      onClose();
    }
  };

  const handleDuplicate = () => {
    onDuplicate();
    onClose();
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl glass-card z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDuplicate}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Duplicate"
                  >
                    <FiCopy size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-text mb-4">{task.title}</h2>

              {/* Description */}
              {task.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text/60 mb-2">Description</h3>
                  <p className="text-text/70">{task.description}</p>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 text-text/40 mb-1">
                    <FiUser size={16} />
                    <span className="text-sm">Assignee</span>
                  </div>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="sm" />
                      <span className="text-sm text-text">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-text/40">Unassigned</span>
                  )}
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 text-text/40 mb-1">
                    <FiUser size={16} />
                    <span className="text-sm">Reporter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name={task.reporter?.name} src={task.reporter?.avatarUrl} size="sm" />
                    <span className="text-sm text-text">{task.reporter?.name}</span>
                  </div>
                </div>
                {task.dueDate && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 text-text/40 mb-1">
                      <FiCalendar size={16} />
                      <span className="text-sm">Due Date</span>
                    </div>
                    <span className="text-sm text-text">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {task.estimatedTime && (
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 text-text/40 mb-1">
                      <FiClock size={16} />
                      <span className="text-sm">Estimated Time</span>
                    </div>
                    <span className="text-sm text-text">{task.estimatedTime}h</span>
                  </div>
                )}
              </div>

              {/* Labels */}
              {task.labels && task.labels.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text/60 mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {task.checklist && task.checklist.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text/60 mb-3">Checklist</h3>
                  <Checklist
                    checklist={task.checklist}
                    onToggle={handleChecklistToggle}
                    onAdd={handleAddChecklistItem}
                    onRemove={handleRemoveChecklistItem}
                  />
                </div>
              )}

              {/* Comments */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text/60 mb-3">Comments ({comments.length})</h3>
                <CommentSection
                  comments={comments}
                  onAdd={handleAddComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  currentUserId={user._id}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
