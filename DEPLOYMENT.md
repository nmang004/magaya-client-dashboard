# Deployment Guide

## Prerequisites
- Railway account for backend hosting
- Netlify account for frontend hosting
- Git repository

## Backend Deployment (Railway)

### Step 1: Prepare Your Code
1. Ensure all dependencies are in package.json
2. Create railway.toml configuration
3. Set up environment variables

### Step 2: Deploy to Railway
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
cd server
railway init
```

4. Deploy:
```bash
railway up
```

### Step 3: Configure Environment Variables
In Railway dashboard:
- JWT_SECRET
- NODE_ENV=production
- CLIENT_URL=https://your-app.netlify.app

## Frontend Deployment (Netlify)

### Step 1: Build the Application
```bash
cd client
npm run build
```

### Step 2: Deploy to Netlify

#### Option 1: Netlify CLI
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod --dir=build
```

#### Option 2: Git Integration
1. Push code to GitHub
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Set environment variables

### Step 3: Configure Environment Variables
In Netlify dashboard:
- REACT_APP_API_URL=https://your-app.railway.app/api
- REACT_APP_ENVIRONMENT=production

## Post-Deployment

### Verify Deployment
1. Check health endpoint: https://your-api.railway.app/health
2. Test authentication flow
3. Verify API connections
4. Check for console errors

### Monitoring
1. Set up error tracking (Sentry)
2. Configure uptime monitoring
3. Set up alerts for failures

### Troubleshooting
- Check Railway logs: `railway logs`
- Check Netlify deploy logs in dashboard
- Verify environment variables
- Check CORS configuration

## Final Instructions

### Testing the Application

Start the backend server:
```bash
cd server && npm run dev
```

Start the frontend:
```bash
cd client && npm start
```

Login with demo credentials:
```
Email: demo@client1.com
Password: demo123
```

Test all features:
- View dashboard with animated cards
- Browse shipments with filtering
- View shipment details and timeline
- Check analytics charts
- Review transactions

Test responsive design on mobile devices

### Customization for Production

- Replace mock data with real Magaya API integration
- Implement real authentication with Magaya credentials
- Add PowerBI embedded reports
- Configure proper database (PostgreSQL/MongoDB)
- Set up Redis for caching
- Implement real-time updates with WebSockets
- Add comprehensive error tracking
- Set up CI/CD pipeline