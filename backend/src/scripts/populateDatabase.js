import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import Task from '../models/Task.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import connectDB from '../config/db.js';

// Sample data
const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Oliver', 'Isabella', 'Elijah', 'Mia', 'Lucas', 'Charlotte', 'Mason', 'Amelia', 'Ethan', 'Harper', 'Alexander', 'Evelyn'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'];

const skillsList = ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Flutter', 'React Native', 'AWS', 'Docker', 'Kubernetes', 'AI/ML', 'UI/UX', 'Figma', 'TypeScript', 'GraphQL', 'Redis', 'Elasticsearch', 'Git', 'CI/CD'];

const locations = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Toronto, Canada', 'Berlin, Germany', 'Sydney, Australia', 'Singapore', 'Bangalore, India', 'Tokyo, Japan', 'Amsterdam, Netherlands'];

const projectTitles = [
  'AI Resume Builder',
  'Hospital Management System',
  'E-Commerce Platform',
  'Smart Inventory System',
  'AI Chat Application',
  'Food Delivery App',
  'Learning Management System',
  'Expense Tracker',
  'Travel Planner',
  'Crypto Portfolio Tracker',
  'Freelance Marketplace',
  'Developer Portfolio Builder',
  'AI Interview Platform',
  'Online Voting System',
  'Healthcare Dashboard'
];

const teamNames = [
  'Frontend Team',
  'Backend Team',
  'AI Team',
  'DevOps Team',
  'Mobile Team',
  'UI/UX Team',
  'QA Team',
  'Product Team'
];

const taskComments = [
  "I'll work on authentication today.",
  "The API integration is completed.",
  "Please review my PR.",
  "The responsive UI is finished.",
  "Fixed the bug in the checkout flow.",
  "Added unit tests for the user module.",
  "Deployed to staging environment.",
  "Need to optimize the database queries.",
  "Updated the documentation.",
  "Refactored the code for better performance.",
  "Added error handling for edge cases.",
  "Implemented the new feature request.",
  "Fixed accessibility issues.",
  "Updated dependencies to latest versions.",
  "Added caching layer for faster response times."
];

const chatMessages = [
  "Hey team, how's the progress?",
  "Almost done with my task.",
  "Can someone help me with the API?",
  "Sure, I'll take a look.",
  "The deployment is scheduled for tomorrow.",
  "Great work everyone!",
  "Let's have a quick sync at 3 PM.",
  "I found a bug in production.",
  "Working on the fix now.",
  "The new feature is ready for testing.",
  "Can we prioritize this task?",
  "Added the requested changes.",
  "The client approved the design.",
  "Starting the code review.",
  "All tests are passing."
];

const notificationTypes = ['project', 'task', 'chat', 'team', 'invite', 'mention'];

const taskTitles = [
  'Setup project structure',
  'Implement authentication',
  'Design database schema',
  'Create API endpoints',
  'Build user interface',
  'Add unit tests',
  'Setup CI/CD pipeline',
  'Deploy to production',
  'Write documentation',
  'Code review',
  'Fix login bug',
  'Optimize database queries',
  'Add caching layer',
  'Implement search feature',
  'Setup monitoring',
  'Create admin dashboard',
  'Add email notifications',
  'Implement file upload',
  'Setup analytics',
  'Create onboarding flow',
  'Add dark mode',
  'Implement pagination',
  'Setup WebSocket',
  'Add rate limiting',
  'Create API documentation',
  'Implement OAuth',
  'Add multi-language support',
  'Setup error tracking',
  'Create backup system',
  'Implement real-time updates',
  'Add data export feature',
  'Setup load balancing',
  'Create mobile responsive design',
  'Add accessibility features',
  'Implement search filters',
  'Setup logging system',
  'Create user profiles',
  'Add social login',
  'Implement notifications',
  'Setup database replication',
  'Add performance monitoring',
  'Create automated tests',
  'Implement feature flags',
  'Setup CDN',
  'Add image optimization',
  'Create data visualization',
  'Implement webhooks',
  'Setup security headers',
  'Add input validation',
  'Create backup strategy',
  'Implement session management',
  'Setup database indexing',
  'Add API rate limiting',
  'Create user activity tracking',
  'Implement email templates',
  'Setup database migrations',
  'Add file compression',
  'Create admin panel',
  'Implement role-based access',
  'Setup database sharding',
  'Add real-time analytics',
  'Create data import feature',
  'Implement API versioning',
  'Setup database backups',
  'Add performance profiling',
  'Create user feedback system',
  'Implement search autocomplete',
  'Setup database connection pooling',
  'Add request logging',
  'Create user onboarding',
  'Implement API caching',
  'Setup database monitoring',
  'Add error handling',
  'Create user settings',
  'Implement API throttling',
  'Setup database optimization',
  'Add request validation',
  'Create user dashboard',
  'Implement API documentation',
  'Setup database scaling',
  'Add performance tuning',
  'Create user notifications',
  'Implement API security',
  'Setup database partitioning',
  'Add request optimization',
  'Create user personalization',
  'Implement API reliability',
  'Setup database archiving',
  'Add performance metrics',
  'Create user recommendations',
  'Implement API load balancing',
  'Setup database upgrades',
  'Add request queuing',
  'Create user segmentation',
  'Implement API rate limiting',
  'Setup database tuning',
  'Add request batching',
  'Create user targeting',
  'Implement API caching',
  'Setup database monitoring',
  'Add request compression',
  'Create user engagement',
  'Implement API security',
  'Setup database optimization',
  'Add request validation',
  'Create user experience',
  'Implement API usability',
  'Setup database performance',
  'Add request documentation',
  'Create user journey',
  'Implement API adoption',
  'Setup database maintenance',
  'Add request support',
  'Create user lifecycle',
  'Implement API integration',
  'Setup database upgrades',
  'Add request training',
  'Create user onboarding',
  'Implement API documentation',
  'Setup database migration',
  'Add request guides',
  'Create user education',
  'Implement API tutorials',
  'Setup database deployment',
  'Add request examples',
  'Create user community',
  'Implement API forums',
  'Setup database hosting',
  'Add request feedback',
  'Create user support',
  'Implement API help',
  'Setup database security',
  'Add request assistance',
  'Create user success',
  'Implement API success',
  'Setup database reliability',
  'Add request success',
  'Create user value',
  'Implement API value',
  'Setup database value',
  'Add request value',
  'Create user impact',
  'Implement API impact',
  'Setup database impact',
  'Add request impact'
];

const taskLabels = ['bug', 'feature', 'enhancement', 'documentation', 'urgent', 'frontend', 'backend', 'database', 'api', 'ui', 'testing', 'deployment', 'security', 'performance', 'accessibility'];

const taskPriorities = ['low', 'medium', 'high', 'urgent'];

const taskStatuses = ['todo', 'in-progress', 'review', 'completed'];

// Helper functions
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateEmail = (firstName, lastName) => `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 999)}@gmail.com`;

const generateUsers = async (count) => {
  const users = [];
  const password = 'password123'; // Don't hash - let the User model pre-save hook handle it

  // Add the specific user requested
  users.push({
    name: 'Pavan',
    email: 'pavan@gmail.com',
    password,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=pavan`,
    bio: `Passionate developer with ${getRandomInt(2, 8)} years of experience. Love building scalable applications and solving complex problems.`,
    skills: getRandomItems(skillsList, getRandomInt(3, 6)),
    experience: `${getRandomInt(2, 8)} years of experience in ${getRandomItems(skillsList, 3).join(', ')}`,
    education: getRandomItem(['BS Computer Science', 'MS Software Engineering', 'BS Information Technology', 'PhD Computer Science', 'Bootcamp Graduate']),
    github: `https://github.com/pavan`,
    linkedin: `https://linkedin.com/in/pavan`,
    portfolio: `https://pavan.dev`,
    location: getRandomItem(locations),
    availability: getRandomItem(['available', 'busy', 'unavailable']),
    lastActive: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    isSuspended: false
  });

  // Generate remaining users
  for (let i = 1; i < count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const userSkills = getRandomItems(skillsList, getRandomInt(3, 6));

    users.push({
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      password,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
      bio: `Passionate ${userSkills[0]} developer with ${getRandomInt(2, 8)} years of experience. Love building scalable applications and solving complex problems.`,
      skills: userSkills,
      experience: `${getRandomInt(2, 8)} years of experience in ${userSkills.join(', ')}`,
      education: getRandomItem(['BS Computer Science', 'MS Software Engineering', 'BS Information Technology', 'PhD Computer Science', 'Bootcamp Graduate']),
      github: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      portfolio: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev`,
      location: getRandomItem(locations),
      availability: getRandomItem(['available', 'busy', 'unavailable']),
      lastActive: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
      isSuspended: false
    });
  }

  return await User.create(users);
};

const generateProjects = async (users, count) => {
  const projects = [];
  const techStacks = [
    ['React', 'Node.js', 'MongoDB'],
    ['Next.js', 'Python', 'PostgreSQL'],
    ['Vue.js', 'Express', 'MySQL'],
    ['React Native', 'Node.js', 'Firebase'],
    ['Flutter', 'Django', 'PostgreSQL'],
    ['React', 'Java', 'Spring Boot'],
    ['Next.js', 'Go', 'MongoDB'],
    ['Vue.js', 'Python', 'Django'],
    ['React', 'Express', 'PostgreSQL'],
    ['Angular', 'Node.js', 'MongoDB'],
    ['React', 'FastAPI', 'PostgreSQL'],
    ['Next.js', 'GraphQL', 'MongoDB'],
    ['React', 'Laravel', 'MySQL'],
    ['Vue.js', 'Node.js', 'PostgreSQL'],
    ['React', 'Django', 'PostgreSQL']
  ];

  for (let i = 0; i < count; i++) {
    const owner = getRandomItem(users);
    const otherMembers = getRandomItems(users.filter(u => u._id.toString() !== owner._id.toString()), getRandomInt(2, 5));
    const stack = techStacks[i % techStacks.length];
    const status = getRandomItem(['planning', 'in-progress', 'completed', 'on-hold']);

    // Make ALL users members of all projects so any login shows data
    const allMembers = users.map(u => ({
      user: u._id,
      role: u._id.toString() === owner._id.toString() ? 'owner' : getRandomItem(['maintainer', 'contributor']),
      joinedAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    }));

    const project = {
      title: projectTitles[i],
      description: `A comprehensive ${projectTitles[i].toLowerCase()} built with modern technologies. Features include user authentication, real-time updates, and responsive design.`,
      stack,
      status,
      repository: `https://github.com/${owner.name.replace(/\s/g, '').toLowerCase()}/${projectTitles[i].replace(/\s/g, '-').toLowerCase()}`,
      demo: `https://${projectTitles[i].replace(/\s/g, '-').toLowerCase()}.demo.com`,
      owner: owner._id,
      members: allMembers,
      maxMembers: getRandomInt(5, 15),
      tags: getRandomItems(stack, getRandomInt(2, 4)),
      isPublic: true,
      activity: [
        {
          user: owner._id,
          action: 'created_project',
          description: `Created ${projectTitles[i]}`,
          createdAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
        }
      ]
    };

    projects.push(project);
  }

  return await Project.create(projects);
};

const generateTeams = async (users, projects, count) => {
  const teams = [];

  for (let i = 0; i < count; i++) {
    const owner = getRandomItem(users);
    const relatedProjects = getRandomItems(projects, getRandomInt(1, 3));
    const projectMembers = relatedProjects.flatMap(p => p.members.map(m => m.user));
    const uniqueMembers = [...new Set(projectMembers.map(u => u.toString()))];
    const memberUsers = users.filter(u => uniqueMembers.includes(u._id.toString()) && u._id.toString() !== owner._id.toString());
    const finalMembers = getRandomItems(memberUsers, getRandomInt(3, 6));

    // Make ALL users members of all teams so any login shows data
    const allMembers = users.map(u => ({
      user: u._id,
      role: u._id.toString() === owner._id.toString() ? 'owner' : getRandomItem(['admin', 'member']),
      joinedAt: getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date())
    }));

    const team = {
      name: teamNames[i],
      description: `A dedicated ${teamNames[i].toLowerCase()} focused on delivering high-quality solutions and innovative features.`,
      owner: owner._id,
      members: allMembers,
      stats: {
        projectsCompleted: getRandomInt(5, 20),
        activeProjects: relatedProjects.filter(p => p.status === 'in-progress').length || getRandomInt(1, 5),
        totalTasks: getRandomInt(50, 200),
        completedTasks: getRandomInt(30, 150)
      },
      tags: getRandomItems(skillsList, getRandomInt(2, 4)),
      isPublic: true,
      activity: [
        {
          user: owner._id,
          action: 'created_team',
          description: `Created ${teamNames[i]}`,
          createdAt: getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date())
        }
      ]
    };

    teams.push(team);
  }

  return await Team.create(teams);
};

const generateTasks = async (users, projects, count) => {
  const tasks = [];
  const tasksPerProject = Math.floor(count / projects.length);

  for (const project of projects) {
    const projectTasks = getRandomItems(taskTitles, tasksPerProject);

    for (let i = 0; i < projectTasks.length; i++) {
      // Assign ALL users to each task so any login shows data
      const assignees = getRandomItems(users, getRandomInt(3, 8));
      
      const createdBy = getRandomItem(users);
      
      const statusRoll = Math.random();
      let status;
      if (statusRoll < 0.4) {
        status = 'todo';
      } else if (statusRoll < 0.7) {
        status = 'in-progress';
      } else if (statusRoll < 0.85) {
        status = 'review';
      } else {
        status = 'completed';
      }

      const priority = getRandomItem(taskPriorities);

      const task = {
        title: projectTasks[i],
        description: `Implement ${projectTasks[i].toLowerCase()} for the ${project.title} project. Ensure proper error handling and testing.`,
        status,
        priority,
        assignedTo: assignees,
        labels: getRandomItems(taskLabels, getRandomInt(1, 3)),
        dueDate: getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        checklist: getRandomItems([
          { text: 'Research requirements', completed: true },
          { text: 'Create design mockups', completed: Math.random() > 0.5 },
          { text: 'Implement core functionality', completed: status === 'completed' ? true : Math.random() > 0.7 },
          { text: 'Write unit tests', completed: status === 'completed' ? true : Math.random() > 0.8 },
          { text: 'Code review', completed: status === 'completed' ? true : false }
        ], getRandomInt(2, 5)).map(item => ({
          text: item.text,
          completed: item.completed,
          createdAt: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
          completedAt: item.completed ? getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()) : null
        })),
        comments: [],
        project: project._id,
        createdBy,
        position: i,
        activity: [
          {
            user: createdBy,
            action: 'created_task',
            description: `Created task: ${projectTasks[i]}`,
            createdAt: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
          }
        ]
      };

      if (status === 'completed') {
        task.activity.push({
          user: getRandomItem(assignees),
          action: 'completed_task',
          description: `Completed task: ${projectTasks[i]}`,
          createdAt: getRandomDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), new Date())
        });
      }

      tasks.push(task);
    }
  }

  return await Task.create(tasks);
};

const generateTaskComments = async (users, tasks) => {
  for (const task of tasks) {
    const commentCount = getRandomInt(1, 5);
    const commentUsers = getRandomItems(users, commentCount);

    for (const user of commentUsers) {
      task.comments.push({
        user: user._id,
        content: getRandomItem(taskComments),
        createdAt: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
      });
    }

    await task.save();
  }
};

const generateConversations = async (users, projects, teams) => {
  const conversations = [];

  for (let i = 0; i < 10; i++) {
    const user1 = getRandomItem(users);
    const user2 = getRandomItem(users.filter(u => u._id.toString() !== user1._id.toString()));

    conversations.push({
      type: 'private',
      participants: [
        { user: user1._id, joinedAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()) },
        { user: user2._id, joinedAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()) }
      ],
      unreadCounts: [
        { user: user1._id, count: getRandomInt(0, 5) },
        { user: user2._id, count: getRandomInt(0, 5) }
      ]
    });
  }

  for (const project of projects.slice(0, 5)) {
    // Include ALL users in project conversations
    conversations.push({
      type: 'project',
      participants: users.map(u => ({
        user: u._id,
        joinedAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      })),
      project: project._id,
      unreadCounts: users.map(u => ({
        user: u._id,
        count: getRandomInt(0, 10)
      }))
    });
  }

  for (const team of teams.slice(0, 5)) {
    // Include ALL users in team conversations
    conversations.push({
      type: 'team',
      participants: users.map(u => ({
        user: u._id,
        joinedAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      })),
      team: team._id,
      unreadCounts: users.map(u => ({
        user: u._id,
        count: getRandomInt(0, 10)
      }))
    });
  }

  return await Conversation.create(conversations);
};

const generateMessages = async (users, conversations) => {
  for (const conversation of conversations) {
    const messageCount = getRandomInt(5, 20);
    const participantIds = conversation.participants.map(p => p.user);

    for (let i = 0; i < messageCount; i++) {
      const sender = getRandomItem(participantIds);
      const message = await Message.create({
        conversation: conversation._id,
        sender,
        content: getRandomItem(chatMessages),
        messageType: 'text',
        readBy: getRandomItems(participantIds, getRandomInt(1, participantIds.length)).map(u => ({
          user: u,
          readAt: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
        }))
      });

      conversation.lastMessage = message._id;
      
      const unreadUsers = participantIds.filter(u => {
        const hasRead = message.readBy.some(r => r.user.toString() === u.toString());
        return !hasRead && Math.random() > 0.5;
      });
      
      conversation.unreadCounts = conversation.unreadCounts.map(uc => {
        if (unreadUsers.some(u => u.toString() === uc.user.toString())) {
          return { user: uc.user, count: uc.count + 1 };
        }
        return uc;
      });
      
      await conversation.save();
    }
  }
};

const generateNotifications = async (users, projects, tasks, teams) => {
  const notifications = [];

  for (const user of users) {
    const notificationCount = getRandomInt(5, 15);

    for (let i = 0; i < notificationCount; i++) {
      const type = getRandomItem(notificationTypes);
      const project = getRandomItem(projects);
      const task = getRandomItem(tasks);
      const team = getRandomItem(teams);

      let title = '';
      let notificationMessage = '';
      let actionUrl = '';

      switch (type) {
        case 'project':
          title = 'Project Update';
          notificationMessage = `New update in ${project.title}`;
          actionUrl = `/dashboard/projects/${project._id}`;
          break;
        case 'task':
          title = 'Task Assigned';
          notificationMessage = `You have been assigned to: ${task.title}`;
          actionUrl = `/dashboard/tasks`;
          break;
        case 'chat':
          title = 'New Message';
          notificationMessage = 'You have a new message';
          actionUrl = '/dashboard/messages';
          break;
        case 'team':
          title = 'Team Update';
          notificationMessage = `New update in ${team.name}`;
          actionUrl = `/dashboard/teams/${team._id}`;
          break;
        case 'invite':
          title = 'Project Invitation';
          notificationMessage = `You have been invited to join ${project.title}`;
          actionUrl = `/dashboard/projects/${project._id}`;
          break;
        case 'mention':
          title = 'New Mention';
          notificationMessage = 'You were mentioned in a comment';
          actionUrl = `/dashboard/tasks`;
          break;
      }

      const notificationData = {
        recipient: user._id,
        type,
        title,
        actionUrl,
        isRead: Math.random() > 0.5,
        readAt: Math.random() > 0.5 ? getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()) : undefined,
        priority: getRandomItem(['low', 'medium', 'high']),
        createdAt: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
        metadata: { messageContent: notificationMessage, notificationMessage }
      };

      if (type === 'project' || type === 'invite') {
        notificationData.project = project._id;
      }
      if (type === 'task' || type === 'mention') {
        notificationData.task = task._id;
      }
      if (type === 'team') {
        notificationData.team = team._id;
      }

      notifications.push(notificationData);
    }
  }

  return await Notification.create(notifications);
};

const addProjectActivities = async (projects, users) => {
  for (const project of projects) {
    const activities = [
      { action: 'updated_description', description: 'Updated project description' },
      { action: 'added_member', description: 'Added new team member' },
      { action: 'updated_status', description: 'Changed project status' },
      { action: 'added_tag', description: 'Added new tag' },
      { action: 'commented', description: 'Added a comment' }
    ];

    for (let i = 0; i < getRandomInt(3, 8); i++) {
      const activity = getRandomItem(activities);
      const user = getRandomItem(project.members.map(m => m.user));

      project.activity.push({
        user,
        action: activity.action,
        description: activity.description,
        createdAt: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      });
    }

    await project.save();
  }
};

const addTeamActivities = async (teams, users) => {
  for (const team of teams) {
    const activities = [
      { action: 'updated_description', description: 'Updated team description' },
      { action: 'added_member', description: 'Added new team member' },
      { action: 'updated_stats', description: 'Updated team statistics' },
      { action: 'added_tag', description: 'Added new tag' },
      { action: 'completed_project', description: 'Completed a project' }
    ];

    for (let i = 0; i < getRandomInt(3, 8); i++) {
      const activity = getRandomItem(activities);
      const user = getRandomItem(team.members.map(m => m.user));

      team.activity.push({
        user,
        action: activity.action,
        description: activity.description,
        createdAt: getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date())
      });
    }

    await team.save();
  }
};

const populateDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Dropping indexes...');
    try {
      await User.collection.dropIndex('username_1');
    } catch (error) {
      // Index doesn't exist, ignore
    }

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Team.deleteMany({});
    await Task.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});

    console.log('Generating users...');
    const users = await generateUsers(20);
    console.log(`Created ${users.length} users`);

    console.log('Generating projects...');
    const projects = await generateProjects(users, 15);
    console.log(`Created ${projects.length} projects`);

    console.log('Generating teams...');
    const teams = await generateTeams(users, projects, 8);
    console.log(`Created ${teams.length} teams`);

    console.log('Generating tasks...');
    const tasks = await generateTasks(users, projects, 120);
    console.log(`Created ${tasks.length} tasks`);

    console.log('Generating task comments...');
    await generateTaskComments(users, tasks);
    console.log('Added comments to tasks');

    console.log('Generating conversations...');
    const conversations = await generateConversations(users, projects, teams);
    console.log(`Created ${conversations.length} conversations`);

    console.log('Generating messages...');
    await generateMessages(users, conversations);
    console.log('Added messages to conversations');

    console.log('Generating notifications...');
    await generateNotifications(users, projects, tasks, teams);
    console.log('Created notifications');

    console.log('Adding project activities...');
    await addProjectActivities(projects, users);
    console.log('Added project activities');

    console.log('Adding team activities...');
    await addTeamActivities(teams, users);
    console.log('Added team activities');

    console.log('\n✅ Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Teams: ${teams.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Conversations: ${conversations.length}`);
    console.log(`- Notifications: ${await Notification.countDocuments()}`);

    console.log('\n🔑 Demo user credentials:');
    console.log(`Email: ${users[0].email}`);
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDatabase();
