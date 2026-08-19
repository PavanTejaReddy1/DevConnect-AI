import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import ImageUploader from '../../components/profile/ImageUploader.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    availability: 'available',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    portfolio: '',
    skills: [],
    experience: [],
    education: [],
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const profile = data.data;
        setFormData({
          name: profile.name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          location: profile.location || '',
          availability: profile.availability || 'available',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          twitter: profile.twitter || '',
          website: profile.website || '',
          portfolio: profile.portfolio || '',
          skills: profile.skills || [],
          experience: profile.experience || [],
          education: profile.education || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '', level: 'intermediate', category: '' }],
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', description: '', startDate: '', endDate: '', currentlyWorking: false }],
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { college: '', degree: '', branch: '', year: '' }],
    });
  };

  const handleRemoveEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-text">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Avatar"
            currentImage={user?.avatarUrl}
            onImageChange={setAvatarFile}
            aspectRatio="square"
          />
          <ImageUploader
            label="Cover Image"
            currentImage={user?.coverImage}
            onImageChange={setCoverFile}
            aspectRatio="landscape"
          />
        </div>

        {/* Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-text mb-1">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              textarea
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
            <Input
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
            <Input
              label="Portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Skills</h2>
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium"
            >
              <FiPlus size={16} />
              Add Skill
            </button>
          </div>
          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Skill Name"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    placeholder="e.g., React"
                  />
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Level</label>
                    <select
                      value={skill.level}
                      onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <Input
                    label="Category"
                    value={skill.category}
                    onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                    placeholder="e.g., Frontend"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors mt-6"
                >
                  <FiX size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Experience</h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium"
            >
              <FiPlus size={16} />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-border rounded-xl space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium text-text">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="p-1 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  />
                  <Input
                    label="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    disabled={exp.currentlyWorking}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`currently-working-${index}`}
                    checked={exp.currentlyWorking}
                    onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor={`currently-working-${index}`} className="text-sm text-text">
                    Currently working here
                  </label>
                </div>
                <Input
                  label="Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  textarea
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Education</h2>
            <button
              type="button"
              onClick={handleAddEducation}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium"
            >
              <FiPlus size={16} />
              Add Education
            </button>
          </div>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-border rounded-xl space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium text-text">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="p-1 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="College/University"
                    value={edu.college}
                    onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                  />
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                  <Input
                    label="Branch/Major"
                    value={edu.branch}
                    onChange={(e) => handleEducationChange(index, 'branch', e.target.value)}
                  />
                  <Input
                    label="Year"
                    type="number"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
