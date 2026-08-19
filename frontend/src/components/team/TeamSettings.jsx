import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLock, FiGlobe, FiTrash2 } from 'react-icons/fi';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import ImageUploader from '../profile/ImageUploader.jsx';
import toast from 'react-hot-toast';

export default function TeamSettings({ isOpen, onClose, team, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    visibility: team?.visibility || 'public',
    skills: team?.skills?.join(', ') || '',
    techStack: team?.techStack?.join(', ') || '',
    openPositions: team?.openPositions?.join(', ') || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        openPositions: formData.openPositions.split(',').map(s => s.trim()).filter(Boolean),
      };

      await onUpdate(updateData);
      toast.success('Team updated successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      toast.success('Team deleted successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to delete team');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: team?.name || '',
      description: team?.description || '',
      visibility: team?.visibility || 'public',
      skills: team?.skills?.join(', ') || '',
      techStack: team?.techStack?.join(', ') || '',
      openPositions: team?.openPositions?.join(', ') || '',
    });
    setLogoFile(null);
    setBannerFile(null);
    setShowDeleteConfirm(false);
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
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="glass-card w-full max-w-2xl p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Team Settings</h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploader
                    label="Team Logo"
                    currentImage={team?.logo}
                    onImageChange={setLogoFile}
                    aspectRatio="square"
                  />
                  <ImageUploader
                    label="Team Banner"
                    currentImage={team?.banner}
                    onImageChange={setBannerFile}
                    aspectRatio="landscape"
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Team Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Visibility</label>
                    <select
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  textarea
                  rows={3}
                  maxLength={500}
                />

                <Input
                  label="Skills (comma-separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python..."
                />

                <Input
                  label="Tech Stack (comma-separated)"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Express, MongoDB..."
                />

                <Input
                  label="Open Positions (comma-separated)"
                  name="openPositions"
                  value={formData.openPositions}
                  onChange={handleChange}
                  placeholder="Frontend Developer, Backend Developer..."
                />

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2"
                  >
                    <FiTrash2 size={18} />
                    Delete Team
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Delete Confirmation */}
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
                  >
                    <div className="glass-card p-6 max-w-sm w-full">
                      <h3 className="text-lg font-bold text-text mb-2">Delete Team?</h3>
                      <p className="text-text/60 mb-6">
                        This action cannot be undone. All team data will be permanently deleted.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          onClick={handleDelete}
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
