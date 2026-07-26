import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Card from '../ui/Card.jsx';
import { teamService } from '../../services/teamService.js';

export default function TeamFormModal({ isOpen, onClose, team = null, onSuccess }) {
  const isEditing = Boolean(team);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState(team?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: team || {
      name: '',
      description: '',
      isPublic: false,
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (item) => {
    setTags(tags.filter(t => t !== item));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const teamData = {
        ...data,
        tags,
      };

      if (isEditing) {
        await teamService.updateTeam(team._id, teamData);
      } else {
        await teamService.createTeam(teamData);
      }

      reset();
      setTags([]);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setTags(team?.tags || []);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text dark:text-slate-100">
                    {isEditing ? 'Edit Team' : 'Create New Team'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 text-text/60 transition-colors hover:bg-text/5 hover:text-text dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Team Name"
                    {...register('name', { required: 'Team name is required' })}
                    error={errors.name?.message}
                    placeholder="e.g., Frontend Squad"
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder="Describe your team..."
                      rows={3}
                      className={`input-field min-h-[80px] resize-none ${errors.description ? '!border-danger focus:!ring-danger/20' : ''}`}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs font-medium text-danger">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
                      Tags
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag (e.g., frontend, design)"
                        className="flex-1"
                      />
                      <Button type="button" variant="secondary" onClick={addTag}>
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((item) => (
                          <span
                            key={item}
                            className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeTag(item)}
                              className="hover:text-accent/80"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      {...register('isPublic')}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="isPublic" className="text-sm text-text dark:text-slate-300">
                      Public Team (others can request to join)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                      {isEditing ? 'Update Team' : 'Create Team'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
