import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import SkillCard from '../../components/profile/SkillCard.jsx';
import ExperienceCard from '../../components/profile/ExperienceCard.jsx';
import EducationCard from '../../components/profile/EducationCard.jsx';
import ProfileStats from '../../components/profile/ProfileStats.jsx';
import ActivityCard from '../../components/profile/ActivityCard.jsx';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ProfileOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setProfileData(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 glass-card animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 glass-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const userData = profileData || user;

  // Mock stats - will be replaced with actual API data
  const mockStats = {
    projects: 12,
    teams: 5,
    tasks: 45,
    reputation: 89,
  };

  // Mock activity - will be replaced with actual API data
  const mockActivity = [
    { type: 'project', title: 'Completed E-commerce Platform', description: 'Full-stack project with React and Node.js', time: '2 hours ago' },
    { type: 'task', title: 'Fixed authentication bug', description: 'Resolved JWT token expiration issue', time: '1 day ago' },
    { type: 'team', title: 'Joined AI Research Team', description: 'New team collaboration on ML project', time: '3 days ago' },
    { type: 'project', title: 'Started Mobile App Redesign', description: 'UI/UX overhaul of mobile application', time: '5 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader user={userData} isOwnProfile={true} onEdit={handleEditProfile} />

      {/* Stats */}
      <ProfileStats stats={mockStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          {userData.skills && userData.skills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text">Skills</h2>
                <button className="text-sm text-primary hover:text-primary-dark font-medium">
                  + Add Skill
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.skills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {userData.experience && userData.experience.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text">Experience</h2>
                <button className="text-sm text-primary hover:text-primary-dark font-medium">
                  + Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {userData.experience.map((exp, index) => (
                  <ExperienceCard key={index} experience={exp} />
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {userData.education && userData.education.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text">Education</h2>
                <button className="text-sm text-primary hover:text-primary-dark font-medium">
                  + Add Education
                </button>
              </div>
              <div className="space-y-4">
                {userData.education.map((edu, index) => (
                  <EducationCard key={index} education={edu} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {mockActivity.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          {(userData.github || userData.linkedin || userData.portfolio || userData.website) && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Portfolio & Links</h2>
              <div className="space-y-3">
                {userData.portfolio && (
                  <a
                    href={userData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-gray-100 hover:bg-primary/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-text">Portfolio</p>
                    <p className="text-xs text-text/40">{userData.portfolio}</p>
                  </a>
                )}
                {userData.github && (
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-gray-100 hover:bg-primary/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-text">GitHub</p>
                    <p className="text-xs text-text/40">{userData.github}</p>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
