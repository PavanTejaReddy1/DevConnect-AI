# DevConnect AI

A full-stack platform for developers to collaborate on projects, build teams, and leverage AI-powered tools for productivity.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control (User, Admin, Moderator)
- **Project Management**: Create, join, and manage projects with team collaboration features
- **Team Collaboration**: Form teams, invite members, and manage roles
- **Task Management**: Kanban-style task boards with AI-powered task breakdown
- **Real-time Messaging**: Socket.io-based real-time chat with typing indicators and reactions
- **AI Integration**: Groq AI for project descriptions, README generation, task breakdown, and code review
- **Admin Panel**: Comprehensive admin dashboard with analytics, user management, and audit logs
- **Notifications**: In-app notifications for project updates, messages, and team activities
- **Responsive Design**: Modern UI built with React, TailwindCSS, and shadcn/ui components

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **Groq AI** - AI services

## Prerequisites

- Node.js >= 18
- MongoDB Atlas account or local MongoDB instance
- Groq AI API key

## Installation

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd devconnect-ai/backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://your-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your-groq-api-key
```

4. Start the server
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
devconnect-ai/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── validations/  # Input validation schemas
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Socket.io server
│   └── uploads/          # File uploads
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # React context
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   └── App.jsx       # Root component
    └── public/           # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/join` - Join project
- `POST /api/projects/:id/leave` - Leave project

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/reorder` - Reorder tasks

### Messages
- `GET /api/conversations` - Get conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message

### AI Services
- `POST /api/ai/description` - Generate project description
- `POST /api/ai/readme` - Generate README
- `POST /api/ai/breakdown` - Generate task breakdown
- `POST /api/ai/review` - Code review

### Admin
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `GET /api/admin/projects` - Get all projects
- `PUT /api/admin/projects/:id/flag` - Flag project
- `GET /api/admin/audit-logs` - Get audit logs

## Security Features

- **Helmet**: Security headers for HTTP responses
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **JWT**: Secure token-based authentication
- **Input Validation**: Request validation using express-validator
- **Role-Based Access Control**: Admin and moderator roles for sensitive operations
- **Audit Logging**: Track all admin actions for compliance

## Environment Variables

### Backend
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time
- `CLIENT_URL` - Frontend URL for CORS
- `GROQ_API_KEY` - Groq AI API key

### Frontend
- `VITE_API_URL` - Backend API URL
- `VITE_SOCKET_URL` - Socket.io server URL

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Build and start the server
```bash
npm run build
npm start
```

### Frontend Deployment

1. Build the frontend
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
