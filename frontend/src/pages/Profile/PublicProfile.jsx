import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import SkillCard from '../../components/profile/SkillCard.jsx';
import ExperienceCard from '../../components/profile/ExperienceCard.jsx';
import EducationCard from '../../components/profile/EducationCard.jsx';
import ProfileStats from '../../components/profile/ProfileStats.jsx';
import ActivityCard from '../../components/profile/ActivityCard.jsx';
import { FiArrowLeft } from 'react-icons/fi';

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`);
      const data = await response.json();
      
      if (response.status === 404) {
        setNotFound(true);
        return;
      }
      
      if (data.success) {
        setProfileData(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
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

  if (notFound) {
    return (
      <div className="glass-card p-12 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Profile Not Found</h1>
        <p className="text-text/60 mb-6">The user @{username} does not exist.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text/60 hover:text-text transition-colors"
      >
        <FiArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Profile Header */}
      <ProfileHeader user={profileData} isOwnProfile={false} />

      {/* Stats */}
      <ProfileStats stats={mockStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          {profileData.skills && profileData.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.skills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profileData.experience && profileData.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Experience</h2>
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <ExperienceCard key={index} experience={exp} />
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profileData.education && profileData.education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Education</h2>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
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
          {(profileData.github || profileData.linkedin || profileData.portfolio || profileData.website) && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Portfolio & Links</h2>
              <div className="space-y-3">
                {profileData.portfolio && (
                  <a
                    href={profileData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-gray-100 hover:bg-primary/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-text">Portfolio</p>
                    <p className="text-xs text-text/40">{profileData.portfolio}</p>
                  </a>
                )}
                {profileData.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-gray-100 hover:bg-primary/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-text">GitHub</p>
                    <p className="text-xs text-text/40">{profileData.github}</p>
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
