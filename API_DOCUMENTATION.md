# DevConnect AI API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "",
    "bio": "",
    "skills": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Full stack developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

---

## Projects

### Get All Projects
```http
GET /projects?page=1&limit=20&search=react&status=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search query
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "project_id",
        "title": "Project Title",
        "description": "Project description",
        "status": "active",
        "isFeatured": false,
        "isFlagged": false,
        "owner": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "members": [],
        "stack": ["React", "Node.js"],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "project_id",
    "title": "Project Title",
    "description": "Project description",
    "status": "active",
    "isFeatured": false,
    "isFlagged": false,
    "owner": { ... },
    "members": [ ... ],
    "stack": ["React", "Node.js"],
    "repository": "https://github.com/...",
    "demo": "https://demo.example.com",
    "activity": [ ... ],
    "comments": [ ... ],
    "files": [ ... ]
  }
}
```

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Project description",
  "stack": ["React", "Node.js"],
  "repository": "https://github.com/...",
  "demo": "https://demo.example.com",
  "maxMembers": 5,
  "isPublic": true
}
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Same as create project

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Join Project
```http
POST /projects/:id/join
Authorization: Bearer <token>
```

### Leave Project
```http
POST /projects/:id/leave
Authorization: Bearer <token>
```

### Add Comment
```http
POST /projects/:id/comments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Comment text"
}
```

### Delete Comment
```http
DELETE /projects/:id/comments/:commentId
Authorization: Bearer <token>
```

### Invite Developer
```http
POST /projects/:id/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "developer@example.com"
}
```

### Upload File
```http
POST /projects/:id/files
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: File to upload (max 10MB)

---

## Teams

### Get All Teams
```http
GET /teams?page=1&limit=20&search=react
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "_id": "team_id",
        "name": "Team Name",
        "description": "Team description",
        "isPublic": true,
        "owner": { ... },
        "members": [ ... ],
        "tags": ["React", "Node.js"],
        "joinRequests": [ ... ],
        "activity": [ ... ]
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Team by ID
```http
GET /teams/:id
Authorization: Bearer <token>
```

### Create Team
```http
POST /teams
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Team Name",
  "description": "Team description",
  "isPublic": true,
  "tags": ["React", "Node.js"]
}
```

### Update Team
```http
PUT /teams/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Team
```http
DELETE /teams/:id
Authorization: Bearer <token>
```

### Request to Join
```http
POST /teams/:id/join
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "I'd like to join your team"
}
```

### Leave Team
```http
POST /teams/:id/leave
Authorization: Bearer <token>
```

### Invite Member
```http
POST /teams/:id/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "member"
}
```

### Respond to Join Request
```http
PUT /teams/:id/requests/:requestId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "accepted"
}
```

### Remove Member
```http
DELETE /teams/:id/members/:memberId
Authorization: Bearer <token>
```

### Update Member Role
```http
PUT /teams/:id/members/:memberId/role
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "admin"
}
```

---

## Tasks

### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "task_id",
        "title": "Task title",
        "status": "todo",
        "priority": "medium",
        "position": 0,
        "assignedTo": [ ... ],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Task title",
  "status": "todo",
  "priority": "medium"
}
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Reorder Tasks
```http
PUT /tasks/reorder
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tasks": [
    {
      "id": "task_id",
      "position": 0,
      "status": "todo"
    }
  ]
}
```

---

## Messages

### Get Conversations
```http
GET /conversations
Authorization: Bearer <token>
```

### Get Messages
```http
GET /conversations/:id/messages
Authorization: Bearer <token>
```

### Send Message
```http
POST /conversations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Message text",
  "messageType": "text"
}
```

---

## AI Services

### Generate Project Description
```http
POST /ai/description
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectName": "My Project",
  "projectType": "Web Application",
  "context": "A social media platform"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "Generated description..."
  }
}
```

### Generate README
```http
POST /ai/readme
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectName": "My Project",
  "description": "Project description",
  "techStack": "React, Node.js, MongoDB",
  "features": ["Feature 1", "Feature 2"]
}
```

### Generate Task Breakdown
```http
POST /ai/breakdown
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectDescription": "Build a social media app",
  "deadline": "2 weeks",
  "complexity": "medium"
}
```

---

## Admin (Admin Role Required)

### Get Analytics
```http
GET /admin/analytics?period=week
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalProjects": 50,
    "totalTeams": 25,
    "totalTasks": 200,
    "newUsers": 10,
    "newProjects": 5,
    "newTeams": 2,
    "activeUsers": 30,
    "userRoles": [ ... ],
    "projectStatus": [ ... ]
  }
}
```

### Get All Users
```http
GET /admin/users?page=1&limit=20&role=user&status=active
Authorization: Bearer <token>
```

### Update User Role
```http
PUT /admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "admin"
}
```

### Suspend User
```http
PUT /admin/users/:id/suspend
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Violation of terms"
}
```

### Unsuspend User
```http
PUT /admin/users/:id/unsuspend
Authorization: Bearer <token>
```

### Get All Projects (Admin)
```http
GET /admin/projects?page=1&length=20&search=react&status=active
Authorization: Bearer <token>
```

### Flag Project
```http
PUT /admin/projects/:id/flag
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

### Feature Project
```http
PUT /admin/projects/:id/feature
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "featured": true
}
```

### Get Audit Logs
```http
GET /admin/audit-logs?page=1&limit=20&action=user_suspended
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "log_id",
        "user": { ... },
        "action": "user_suspended",
        "targetType": "User",
        "targetId": "user_id",
        "details": { ... },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Rate Limiting

- **Auth routes**: 50 requests per 15 minutes
- **API routes**: 200 requests per 15 minutes
- **AI routes**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1234567890
```

---

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
