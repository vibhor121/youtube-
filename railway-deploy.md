# 🚀 Railway + Vercel Deployment Guide

## Step 1: Deploy Backend to Railway

### 1.1 Go to Railway
1. Visit [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub

### 1.2 Create Project
1. Click "Deploy from GitHub repo"
2. Select your repository: `vibhor121/youtube-`
3. Railway will automatically detect it's a Node.js project

### 1.3 Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Wait for it to provision (takes 1-2 minutes)
4. Copy the `DATABASE_URL` from the database service

### 1.4 Configure Environment Variables
In your Railway project settings, add these environment variables:

```
DATABASE_URL=postgresql://postgres:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=production
PORT=5000
```

### 1.5 Configure Build Settings
1. Go to your service settings
2. Set the following:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`

### 1.6 Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" manually
3. Wait for deployment to complete
4. Copy your Railway app URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "Sign up" and connect with GitHub

### 2.2 Import Project
1. Click "New Project"
2. Import your GitHub repository: `vibhor121/youtube-`
3. Vercel will auto-detect it's a Next.js project

### 2.3 Configure Build Settings
1. Set **Root Directory** to: `client`
2. Vercel will auto-detect the build settings
3. Click "Deploy"

### 2.4 Configure Environment Variables
In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-nextauth-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2.5 Deploy
1. Vercel will automatically deploy
2. Wait for deployment to complete
3. Copy your Vercel app URL (e.g., `https://your-app.vercel.app`)

## Step 3: Update Google OAuth Settings

### 3.1 Go to Google Cloud Console
1. Visit [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" → "Credentials"

### 3.2 Update OAuth 2.0 Client
1. Click on your OAuth 2.0 Client ID
2. Add these **Authorized Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```
3. Add these **Authorized JavaScript Origins**:
   ```
   http://localhost:3000
   https://your-vercel-app.vercel.app
   ```
4. Save changes

## Step 4: Test Your Deployment

### 4.1 Test Backend
1. Visit `https://your-railway-app.railway.app/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### 4.2 Test Frontend
1. Visit your Vercel app URL
2. Try signing in with Google
3. Test adding videos, comments, and notes

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check DATABASE_URL format
   - Ensure database is accessible

2. **CORS Error**:
   - Add your Vercel URL to CORS settings in server

3. **Authentication Error**:
   - Check Google OAuth redirect URIs
   - Verify environment variables

4. **Build Error**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📊 Monitoring

### Railway:
- View logs in Railway dashboard
- Monitor database usage
- Check deployment status

### Vercel:
- View build logs
- Monitor performance
- Check function logs

## 🎉 Success!

Once deployed, you'll have:
- ✅ Backend running on Railway
- ✅ Frontend running on Vercel
- ✅ PostgreSQL database
- ✅ Google OAuth working
- ✅ All features functional

Your app will be live at your Vercel URL! 🚀
