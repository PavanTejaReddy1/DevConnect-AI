import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Avatar from '../ui/Avatar.jsx';

export default function CommentSection({ comments, onAdd, onEdit, onDelete, currentUserId }) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAdd(newComment.trim());
      setNewComment('');
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.content);
  };

  const handleSaveEdit = (commentId) => {
    if (editText.trim()) {
      onEdit(commentId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-text/40 py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <Avatar
                name={comment.author?.name}
                src={comment.author?.avatarUrl}
                size="sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-text">{comment.author?.name}</span>
                  <span className="text-xs text-text/40">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {comment.edited && (
                    <span className="text-xs text-text/40">(edited)</span>
                  )}
                </div>
                {editingId === comment._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-card/70 backdrop-blur-glass text-text text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-2 bg-gray-100 text-text rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-text/70">{comment.content}</p>
                )}
              </div>
              {comment.author?._id === currentUserId && editingId !== comment._id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="p-1 text-text/40 hover:text-primary transition-colors"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="p-1 text-text/40 hover:text-danger transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}
