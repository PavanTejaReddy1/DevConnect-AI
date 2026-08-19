# DevConnect AI

A modern, full-stack SaaS platform for project management, team collaboration, and AI-powered productivity. Built with React, Node.js, MongoDB, and real-time Socket.io integration.

## Features

### Core Functionality
- **Authentication**: Secure JWT-based authentication with role-based access control
- **User Profiles**: Comprehensive profiles with skills, experience, education, and social links
- **Project Management**: Create, manage, and track projects with team collaboration
- **Team Management**: Create teams, invite members, and manage permissions
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Real-time Chat**: Instant messaging with typing indicators and online status
- **AI Features**: AI-powered content generation using Google Gemini API
- **Admin Panel**: Complete admin dashboard for platform management
- **Notifications**: Real-time notification system with preferences
- **Settings**: Comprehensive user settings for account, security, and appearance

### Technical Highlights
- **Real-time Updates**: Socket.io for instant notifications and chat
- **Glassmorphism UI**: Modern, premium design with glass effects
- **Responsive Design**: Fully responsive across all devices
- **Error Handling**: Comprehensive error boundaries and error pages
- **Security**: Helmet, rate limiting, input sanitization, XSS protection
- **Performance**: Optimized bundle size and loading states

## Tech Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **React Hot Toast**: Toast notifications
- **React Icons**: Icon library
- **Recharts**: Data visualization
- **Socket.io Client**: Real-time client
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **Socket.io**: Real-time server
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Helmet**: Security headers
- **Express Rate Limit**: Rate limiting
- **Express Validator**: Input validation
- **Cloudinary**: File storage
- **Google Generative AI**: AI features

## Project Structure

```
devconnect-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.io setup
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── admin/       # Admin components
│   │   │   ├── ai/          # AI components
│   │   │   ├── auth/        # Auth components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── landing/     # Landing page components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── notifications/ # Notification components
│   │   │   ├── profile/     # Profile components
│   │   │   ├── settings/    # Settings components
│   │   │   ├── task/        # Task components
│   │   │   └── team/        # Team components
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route components
│   │   ├── services/        # API services
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Environment variables template
│   ├── index.html           # HTML template
│   ├── package.json
│   ├── tailwind.config.js   # Tailwind configuration
│   └── vite.config.js       # Vite configuration
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Gemini API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
```

5. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. Start frontend dev server:
```bash
npm run dev
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Profile
- `GET /api/profile/:username` - Get public profile
- `GET /api/profile` - Get own profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/invite` - Invite member
- `POST /api/teams/:id/join` - Join team
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Chat
- `GET /api/conversations` - Get conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message

### AI
- `POST /api/ai/generate` - Generate AI content

### Admin
- `GET /admin/dashboard/stats` - Get admin stats
- `GET /admin/users` - Get all users
- `GET /admin/projects` - Get all projects
- `GET /admin/teams` - Get all teams

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/password` - Change password
- `PUT /api/settings/connect-account` - Connect account
- `DELETE /api/settings/connect-account/:provider` - Disconnect account

## Security Features

- **JWT Authentication**: Secure token-based auth with issuer/audience verification
- **Password Hashing**: Bcrypt with 12 salt rounds
- **Rate Limiting**: Configurable rate limits for API endpoints
- **Helmet**: Security headers and CSP
- **CORS**: Configured cross-origin resource sharing
- **Input Sanitization**: XSS prevention through input sanitization
- **MongoDB Injection**: Protected through Mongoose ODM
- **Role-Based Access**: Admin and user roles with middleware protection

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Development

### Code Style
- Use functional components with hooks
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading and empty states

### Adding New Features
1. Create backend model (if needed)
2. Create backend controller
3. Create backend routes
4. Add route to app.js
5. Create frontend components
6. Add frontend pages
7. Add routes to App.jsx
8. Test thoroughly

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
