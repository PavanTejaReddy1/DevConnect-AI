# DevConnect AI Architecture Guide

This document provides a comprehensive overview of the DevConnect AI application architecture, design decisions, and technical implementation details.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Pattern](#architecture-pattern)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication & Authorization](#authentication--authorization)
- [Real-time Communication](#real-time-communication)
- [AI Integration](#ai-integration)
- [Security Architecture](#security-architecture)
- [Performance Optimization](#performance-optimization)
- [Scalability Considerations](#scalability-considerations)

---

## System Overview

DevConnect AI is a full-stack web application consisting of:

- **Frontend**: React-based SPA with modern UI components
- **Backend**: RESTful API with Socket.io for real-time features
- **Database**: MongoDB for data persistence
- **AI Services**: Google Gemini AI for intelligent features

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │
│   (React)       │◄────────┤   (Express)     │
│                 │ HTTP/WS │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │
                            ┌────────▼────────┐
                            │   MongoDB       │
                            │   (Atlas)       │
                            └─────────────────┘
                                     │
                            ┌────────▼────────┐
                            │  Gemini AI      │
                            │  (External)     │
                            └─────────────────┘
```

---

## Architecture Pattern

### Client-Server Architecture

The application follows a classic client-server pattern:

- **Client**: React SPA communicating via REST API and WebSockets
- **Server**: Express.js handling HTTP requests and Socket.io connections
- **Database**: MongoDB for persistent storage

### Separation of Concerns

- **Frontend**: UI rendering, state management, user interactions
- **Backend**: Business logic, data validation, API endpoints
- **Database**: Data persistence and querying

---

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18 |
| Vite | Build Tool | 5 |
| TailwindCSS | Styling | 3 |
| shadcn/ui | Component Library | Latest |
| React Router | Routing | 6 |
| Socket.io Client | Real-time Client | 4 |
| Recharts | Data Visualization | 2 |
| React Icons | Icons | 4 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web Framework | 4 |
| MongoDB | Database | 6+ |
| Mongoose | ODM | 7+ |
| Socket.io | Real-time Server | 4 |
| JWT | Authentication | 9 |
| Helmet | Security Headers | 7 |
| express-rate-limit | Rate Limiting | 7 |
| express-validator | Validation | 7 |
| @google/generative-ai | AI SDK | Latest |

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── common/          # Shared components (PageHeader, Reveal)
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # UI components (Card, Button, Input, etc.)
├── context/             # React Context (AuthContext)
├── pages/
│   ├── Auth/            # Authentication pages
│   ├── Dashboard/       # Dashboard pages
│   ├── Admin/           # Admin panel pages
│   └── Landing/         # Landing page
├── services/            # API services
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

### Component Architecture

#### Component Hierarchy

```
App
├── AuthProvider
│   ├── LandingPage
│   └── DashboardLayout
│       ├── Sidebar
│       ├── Header
│       └── Content
│           ├── DashboardHome
│           ├── ProjectsPage
│           ├── TeamsPage
│           ├── TasksPage
│           ├── MessagesPage
│           ├── NotificationsPage
│           └── AdminLayout
│               ├── AdminDashboard
│               ├── ManageUsersPage
│               ├── ManageProjectsPage
│               ├── ManageReportsPage
│               └── PlatformAnalyticsPage
```

#### State Management

- **Local State**: useState for component-level state
- **Global State**: React Context for authentication
- **Server State**: API calls with useEffect

### Routing

React Router handles client-side routing:

```javascript
// Protected routes with authentication check
<Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
<Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
```

### API Service Layer

Centralized API service pattern:

```javascript
// services/projectService.js
export const projectService = {
  getProjects: (params) => axios.get('/api/projects', { params }),
  getProjectById: (id) => axios.get(`/api/projects/${id}`),
  createProject: (data) => axios.post('/api/projects', data),
  // ...
};
```

---

## Backend Architecture

### Directory Structure

```
backend/src/
├── config/              # Configuration (database)
├── controllers/         # Route handlers
├── middleware/          # Express middleware
├── models/              # Mongoose models
├── routes/              # API routes
├── services/            # Business logic (AI)
├── utils/               # Utility functions
├── validations/         # Input validation schemas
├── app.js               # Express app setup
└── server.js            # Socket.io server
```

### Layered Architecture

```
┌─────────────────────────────────┐
│         Routes Layer            │
│    (Route definitions)         │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Middleware Layer           │
│  (Auth, validation, error)     │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Controllers Layer           │
│   (Request handlers)            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Models Layer               │
│   (Mongoose schemas)            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Database Layer             │
│      (MongoDB)                  │
└─────────────────────────────────┘
```

### Middleware Stack

```javascript
app.use(helmet());                    // Security headers
app.use(cors());                      // CORS configuration
app.use(express.json());              // Body parsing
app.use(rateLimit());                 // Rate limiting
app.use(protect);                     // JWT authentication
app.use(authorize('admin'));         // Role authorization
```

---

## Database Design

### MongoDB Collections

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum['user', 'admin', 'moderator'],
  avatarUrl: String,
  bio: String,
  skills: [String],
  github: String,
  linkedin: String,
  isSuspended: Boolean,
  suspensionReason: String,
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Project Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: Enum['planning', 'in-progress', 'completed', 'on-hold', 'archived'],
  isFeatured: Boolean,
  isFlagged: Boolean,
  flagReason: String,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: Enum['owner', 'admin', 'member']
  }],
  stack: [String],
  repository: String,
  demo: String,
  maxMembers: Number,
  isPublic: Boolean,
  invites: [{
    email: String,
    status: Enum['pending', 'accepted', 'rejected']
  }],
  activity: [{
    user: ObjectId (ref: User),
    action: String,
    description: String,
    createdAt: Date
  }],
  comments: [{
    user: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  files: [{
    name: String,
    url: String,
    size: Number,
    uploadedBy: ObjectId (ref: User),
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Team Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  isPublic: Boolean,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: Enum['owner', 'admin', 'member'],
    joinedAt: Date
  }],
  tags: [String],
  joinRequests: [{
    user: ObjectId (ref: User),
    message: String,
    status: Enum['pending', 'accepted', 'rejected']
  }],
  activity: [{
    user: ObjectId (ref: User),
    action: String,
    description: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: Enum['todo', 'in-progress', 'review', 'done'],
  priority: Enum['low', 'medium', 'high'],
  position: Number,
  assignedTo: [ObjectId (ref: User)],
  project: ObjectId (ref: Project),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Conversation Collection
```javascript
{
  _id: ObjectId,
  participants: [{
    user: ObjectId (ref: User),
    role: Enum['admin', 'member'],
    joinedAt: Date,
    isOnline: Boolean,
    unreadCount: Number
  }],
  lastMessage: ObjectId (ref: Message),
  typingUsers: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Message Collection
```javascript
{
  _id: ObjectId,
  conversation: ObjectId (ref: Conversation),
  sender: ObjectId (ref: User),
  content: String,
  messageType: Enum['text', 'image', 'file'],
  replyTo: ObjectId (ref: Message),
  reactions: [{
    emoji: String,
    users: [ObjectId (ref: User)]
  }],
  createdAt: Date
}
```

#### Notification Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: Enum['project', 'task', 'chat', 'ai', 'admin', 'team', 'invite', 'mention'],
  title: String,
  message: String,
  actionUrl: String,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

#### AuditLog Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  action: String,
  targetType: String,
  targetId: ObjectId,
  details: Object,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

### Indexes

Optimized indexes for common queries:

```javascript
// User indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isSuspended: 1 });

// Project indexes
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ 'members.user': 1 });

// Team indexes
TeamSchema.index({ owner: 1 });
TeamSchema.index({ isPublic: 1 });
TeamSchema.index({ 'members.user': 1 });

// Task indexes
TaskSchema.index({ project: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ assignedTo: 1 });

// Message indexes
MessageSchema.index({ conversation: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ createdAt: -1 });

// Notification indexes
NotificationSchema.index({ user: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
```

---

## Authentication & Authorization

### JWT Authentication Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage)
   ↓
5. Client includes token in Authorization header
   ↓
6. Server verifies token on protected routes
   ↓
7. Server grants access if valid
```

### Token Structure

```javascript
{
  id: "user_id",
  iat: 1234567890,
  exp: 1235172690
}
```

### Role-Based Access Control

```javascript
// Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// Usage
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
```

### User Roles

- **User**: Standard user access
- **Moderator**: Can moderate content
- **Admin**: Full administrative access

---

## Real-time Communication

### Socket.io Architecture

```
┌─────────────┐         WebSocket          ┌─────────────┐
│   Client    │◄──────────────────────────►│   Server    │
│  (Browser)  │                            │ (Socket.io) │
└─────────────┘                            └─────────────┘
```

### Authentication Flow

```javascript
// Client
const socket = io(socketUrl, {
  auth: { token: jwtToken }
});

// Server
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  socket.user = await User.findById(decoded.id);
  next();
});
```

### Event Types

#### User Events
- `user:online` - User came online
- `user:offline` - User went offline

#### Conversation Events
- `join:conversation` - Join a conversation room
- `leave:conversation` - Leave a conversation room

#### Typing Events
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

#### Message Events
- `message:send` - Send a message
- `message:new` - New message received
- `message:read` - Message marked as read
- `message:reaction` - Reaction added to message

#### Notification Events
- `notification:new` - New notification received

### Room Management

```javascript
// Join conversation
socket.join(conversationId);

// Broadcast to room
io.to(conversationId).emit('message:new', message);

// Leave room
socket.leave(conversationId);
```

---

## AI Integration

### Gemini AI Integration

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const result = await model.generateContent(prompt);
const response = await result.response;
return response.text();
```

### AI Services

1. **Project Description Generator**
   - Input: Project name, type, context
   - Output: Compelling project description

2. **README Generator**
   - Input: Project details, tech stack, features
   - Output: Complete README.md

3. **Task Breakdown**
   - Input: Project description, deadline, complexity
   - Output: Structured task list

4. **Code Review**
   - Input: Code, language, context
   - Output: Code review feedback

### Error Handling

```javascript
try {
  const result = await generateContent(prompt);
  return result;
} catch (error) {
  throw new Error(`AI generation failed: ${error.message}`);
}
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────┐
│     Application Security       │
│  (Input validation, sanitization)│
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     API Security               │
│  (Rate limiting, CORS, Helmet)  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Authentication             │
│  (JWT, role-based access)      │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Data Security               │
│  (Password hashing, encryption) │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Infrastructure Security     │
│  (SSL, firewall, IP whitelist) │
└─────────────────────────────────┘
```

### Security Measures

#### Helmet Configuration
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
})
```

#### Rate Limiting
```javascript
// Auth routes: 50 requests/15min
// API routes: 200 requests/15min
// AI routes: 100 requests/hour
```

#### Input Validation
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/projects',
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - Vite automatically splits code
   - Lazy loading of routes

2. **Bundle Optimization**
   - Tree shaking removes unused code
   - Minification reduces bundle size

3. **Asset Optimization**
   - Image compression
   - Font optimization

### Backend Optimization

1. **Database Optimization**
   - Indexed queries
   - Query optimization
   - Connection pooling

2. **Caching Strategy**
   - Redis for session storage
   - API response caching

3. **Compression**
   - Gzip compression enabled
   - Static file compression

### Monitoring

- Health check endpoint
- Error tracking
- Performance metrics

---

## Scalability Considerations

### Horizontal Scaling

1. **Load Balancing**
   - Nginx as reverse proxy
   - Multiple backend instances

2. **Session Management**
   - Redis for distributed sessions
   - Sticky sessions for Socket.io

3. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for queries

### Vertical Scaling

1. **Resource Optimization**
   - Efficient memory usage
   - CPU optimization

2. **Database Optimization**
   - Connection pooling
   - Query optimization

### Microservices Considerations

Future architecture could evolve to:

- Separate AI service
- Separate notification service
- Separate file storage service

---

## Design Decisions

### Why MongoDB?

- Flexible schema for evolving data
- Native JSON support
- Horizontal scaling
- Rich query capabilities

### Why Socket.io?

- Automatic reconnection
- Room support
- Fallback to polling
- Easy integration with Express

### Why React?

- Component reusability
- Large ecosystem
- Virtual DOM performance
- Strong community support

### Why JWT?

- Stateless authentication
- Cross-platform support
- Built-in expiration
- Easy to implement

---

## Future Improvements

1. **Performance**
   - Implement Redis caching
   - Add CDN for static assets
   - Optimize database queries

2. **Features**
   - Video conferencing
   - File collaboration
   - Advanced analytics

3. **Architecture**
   - Microservices migration
   - Event-driven architecture
   - GraphQL API

---

## Conclusion

This architecture provides a solid foundation for a scalable, secure, and performant web application. The separation of concerns, layered architecture, and modern technology stack ensure maintainability and extensibility for future growth.
