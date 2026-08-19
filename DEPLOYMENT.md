# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- Gemini API key
- Vercel account (for frontend)
- Render account (for backend)

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=https://your-frontend-domain.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
VITE_SOCKET_URL=https://your-backend-domain.onrender.com
```

## Backend Deployment (Render)

1. **Push code to GitHub**
   - Ensure backend code is in a GitHub repository
   - Add `.env` to `.gitignore`

2. **Create Render account**
   - Go to [render.com](https://render.com)
   - Sign up and create a new account

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder
   - Configure:
     - **Name**: devconnect-ai-backend
     - **Region**: Choose nearest region
     - **Branch**: main
     - **Root Directory**: backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   
4. **Add Environment Variables**
   - Go to Environment tab
   - Add all variables from `.env.example`

5. **Deploy**
   - Click "Deploy Web Service"
   - Wait for deployment to complete
   - Copy the backend URL

## Frontend Deployment (Vercel)

1. **Push code to GitHub**
   - Ensure frontend code is in a GitHub repository

2. **Create Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up and create a new account

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: frontend
     - **Build Command**: `npm run build`
     - **Output Directory**: dist

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL` and `VITE_SOCKET_URL`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the frontend URL

6. **Update Backend CORS**
   - Update `CLIENT_URL` in backend Render environment variables
   - Redeploy backend

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0)

2. **Database User**
   - Create a database user with username and password
   - Note down credentials

3. **Network Access**
   - Add IP `0.0.0.0/0` (allow all IPs for Render)
   - Or add Render's specific IP ranges

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Cloudinary Setup

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials**
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

## Gemini API Setup

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

## Post-Deployment Checklist

- [ ] Backend is accessible at the Render URL
- [ ] Frontend is accessible at the Vercel URL
- [ ] API calls work from frontend to backend
- [ ] Socket.io connection works
- [ ] File uploads work (Cloudinary)
- [ ] AI features work (Gemini)
- [ ] Authentication works (login/signup)
- [ ] All pages load correctly
- [ ] 404 and 500 error pages work
- [ ] Rate limiting is active
- [ ] CORS is properly configured

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify MongoDB connection string
- Check environment variables

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration in backend
- Ensure backend is deployed and running

### Socket.io connection fails
- Verify `VITE_SOCKET_URL` matches backend URL
- Check if backend supports WebSocket
- Check Render logs for socket errors

### MongoDB connection fails
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

## Monitoring

- **Render**: Dashboard shows logs, metrics, and deployment status
- **Vercel**: Dashboard shows deployments, analytics, and logs
- **MongoDB Atlas**: Dashboard shows cluster metrics and slow queries
- **Cloudinary**: Dashboard shows usage and bandwidth

## Scaling

### Backend Scaling
- Upgrade to paid Render plan for more resources
- Add Redis for session management
- Use load balancer for multiple instances

### Frontend Scaling
- Vercel automatically scales
- Enable Edge Functions for better performance
- Use CDN for static assets

## Security

- Rotate JWT secrets regularly
- Use environment-specific secrets
- Enable HTTPS (automatic on Vercel/Render)
- Regular security audits
- Keep dependencies updated
