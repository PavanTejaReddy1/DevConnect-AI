# DevConnect AI Deployment Guide

This guide covers deploying DevConnect AI to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Deployment Platforms](#deployment-platforms)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js >= 18 installed
- MongoDB Atlas account or MongoDB server
- Google Gemini AI API key
- Domain name (optional but recommended)
- SSL certificate (for production)

---

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/devconnect
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up and create a free cluster

2. **Configure Network Access**
   - Add your server IP or `0.0.0.0/0` (for all IPs)
   - Whitelist your deployment platform's IP ranges

3. **Create Database User**
   - Go to Database Access
   - Create a new user with read/write permissions
   - Save the connection string

4. **Get Connection String**
   - Go to Connect > Connect your application
   - Copy the connection string
   - Replace `<password>` with your user password

### Self-Hosted MongoDB

1. Install MongoDB on your server
2. Enable authentication
3. Configure firewall rules
4. Use the connection string in your `.env` file

---

## Backend Deployment

### Option 1: Vercel (Serverless)

1. **Prepare for Deployment**
   ```bash
   cd backend
   npm install --production
   ```

2. **Create `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/src/server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel dashboard
   - Settings > Environment Variables
   - Add all backend environment variables

### Option 2: Railway

1. **Deploy via CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Add Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   railway variables set MONGO_URI=your-connection-string
   # ... add other variables
   ```

### Option 3: DigitalOcean / VPS

1. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd devconnect-ai/backend
   npm install --production
   ```

4. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name devconnect-api
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx (Reverse Proxy)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL with Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Add `VITE_API_URL` and `VITE_SOCKET_URL` in Vercel dashboard

### Option 2: Netlify

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Set Environment Variables**
   - Add in Netlify dashboard under Site settings

### Option 3: Nginx (Static Files)

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Copy to Server**
   ```bash
   scp -r dist/* root@your-server:/var/www/devconnect
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       root /var/www/devconnect;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Setup SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Deployment Platforms

### Recommended Platforms

| Platform | Backend | Frontend | Difficulty | Cost |
|----------|---------|----------|------------|------|
| Vercel | ✅ | ✅ | Easy | Free tier available |
| Railway | ✅ | ✅ | Easy | Free tier available |
| Netlify | ❌ | ✅ | Easy | Free tier available |
| DigitalOcean | ✅ | ✅ | Medium | $4-20/month |
| AWS | ✅ | ✅ | Hard | Variable |

---

## Monitoring & Maintenance

### Health Checks

Add health check endpoint monitoring:

```bash
# Using Uptime Robot or similar
https://api.yourdomain.com/api/health
```

### Logs

**PM2 Logs:**
```bash
pm2 logs devconnect-api
```

**Vercel Logs:**
- Access via Vercel dashboard

**Railway Logs:**
- Access via Railway dashboard

### Database Backups

**MongoDB Atlas:**
- Enable automated backups in Atlas settings
- Set retention period (recommended: 30 days)

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://user:pass@cluster/db" --out=./backup
```

### Updates

1. Pull latest code
2. Run `npm install --production`
3. Restart application
4. Monitor for errors

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Check `MONGO_URI` is correct
- Verify IP whitelist in Atlas
- Check network connectivity

**2. CORS Errors**
- Ensure `CLIENT_URL` matches frontend domain
- Check CORS configuration in `app.js`

**3. Socket.io Connection Issues**
- Verify `VITE_SOCKET_URL` is correct
- Check firewall allows WebSocket connections
- Ensure both HTTP and HTTPS are handled

**4. Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

**5. Rate Limiting Issues**
- Adjust rate limits in `app.js`
- Consider implementing Redis for distributed rate limiting

---

## Security Checklist

- [ ] Change default JWT secret
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Restrict database IP access
- [ ] Enable security headers (Helmet)
- [ ] Set up monitoring/alerts
- [ ] Regular database backups
- [ ] Keep dependencies updated

---

## Performance Optimization

### Backend

1. **Enable Compression**
   ```javascript
   app.use(compression());
   ```

2. **Use Redis for Caching**
   ```bash
   npm install redis
   ```

3. **Implement CDN for Static Files**

### Frontend

1. **Enable Code Splitting** (already configured in Vite)
2. **Optimize Images**
3. **Enable Gzip Compression** (handled by hosting platform)
4. **Use CDN for Assets**

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Use Nginx or cloud load balancer
   - Distribute traffic across multiple instances

2. **Session Management**
   - Use Redis for session storage
   - Enable sticky sessions for Socket.io

3. **Database Scaling**
   - Use MongoDB Atlas scaling
   - Implement read replicas

---

## Cost Estimation

### Free Tier Options
- Vercel: Free for hobby projects
- MongoDB Atlas: Free tier (512MB)
- Railway: Free tier ($5 credit/month)

### Production Estimate
- VPS: $5-20/month
- MongoDB Atlas: $9-57/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

**Total: ~$20-80/month for small production setup**

---

## Support

For deployment issues:
1. Check logs for error messages
2. Review this troubleshooting guide
3. Open an issue on GitHub
4. Contact support for platform-specific issues
