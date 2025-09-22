#!/bin/bash

# 🚀 Railway Deployment Helper Script
echo "🚀 YouTube Companion Dashboard - Railway Deployment Helper"
echo "========================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "✅ Railway configuration file created (railway.json)"
echo "✅ Environment variables should be set in Railway dashboard"
echo "✅ Root directory set to 'server'"
echo ""

echo "🔧 Next steps:"
echo "1. Go to your Railway dashboard"
echo "2. Make sure your environment variables are set:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - YOUTUBE_API_KEY"
echo "3. Railway will automatically detect the railway.json file"
echo "4. Deploy your service"
echo ""

echo "🌐 After deployment:"
echo "- Copy your Railway URL (e.g., https://youtube-production-xxxx.up.railway.app)"
echo "- We'll use this URL for the frontend deployment on Vercel"
echo ""

echo "📝 Environment variables needed in Railway:"
echo "DATABASE_URL=postgresql://postgres:password@host:port/database"
echo "JWT_SECRET=your-super-secret-jwt-key-here"
echo "GOOGLE_CLIENT_ID=your-google-client-id"
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret"
echo "YOUTUBE_API_KEY=your-youtube-api-key"
echo "NODE_ENV=production"
echo "PORT=5000"
