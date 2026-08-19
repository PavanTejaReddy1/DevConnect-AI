import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import ImageUploader from '../../components/profile/ImageUploader.jsx';
import toast from 'react-hot-toast';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    skills: '',
    techStack: '',
    openPositions: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const teamData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        openPositions: formData.openPositions.split(',').map(s => s.trim()).filter(Boolean),
      };

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(teamData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Team created successfully');
        navigate(`/teams/${data.data._id}`);
      } else {
        toast.error(data.message || 'Failed to create team');
      }
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/teams')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-text">Create Team</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Team Logo"
            onImageChange={setLogoFile}
            aspectRatio="square"
          />
          <ImageUploader
            label="Team Banner"
            onImageChange={setBannerFile}
            aspectRatio="landscape"
          />
        </div>

        {/* Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Basic Information</h2>
          <div className="space-y-4">
            <Input
              label="Team Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter team name"
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
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              textarea
              rows={3}
              maxLength={500}
              placeholder="Describe your team's purpose and goals"
            />
          </div>
        </div>

        {/* Skills & Tech Stack */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Skills & Tech Stack</h2>
          <div className="space-y-4">
            <Input
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python, Machine Learning..."
            />
            <Input
              label="Tech Stack (comma-separated)"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Express, MongoDB, PostgreSQL..."
            />
            <Input
              label="Open Positions (comma-separated)"
              name="openPositions"
              value={formData.openPositions}
              onChange={handleChange}
              placeholder="Frontend Developer, Backend Developer, UI/UX Designer..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Team'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/teams')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
