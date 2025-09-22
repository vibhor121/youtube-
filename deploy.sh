#!/bin/bash

# 🚀 YouTube Companion Dashboard - Deployment Script
# This script helps you deploy your application to free hosting platforms

echo "🚀 YouTube Companion Dashboard - Deployment Helper"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Available deployment options:"
echo "1. Vercel (Frontend) + Railway (Backend)"
echo "2. Render (Full Stack)"
echo "3. Vercel (Full Stack with API Routes)"
echo "4. Show deployment guide"
echo "5. Exit"

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "🚀 Setting up Vercel + Railway deployment..."
        echo ""
        echo "Step 1: Deploy Backend to Railway"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Create new project from GitHub repo"
        echo "4. Add PostgreSQL service"
        echo "5. Set environment variables:"
        echo "   - DATABASE_URL (from PostgreSQL service)"
        echo "   - JWT_SECRET=your-secret-key"
        echo "   - GOOGLE_CLIENT_ID=your-google-client-id"
        echo "   - GOOGLE_CLIENT_SECRET=your-google-client-secret"
        echo "   - YOUTUBE_API_KEY=your-youtube-api-key"
        echo "   - NODE_ENV=production"
        echo ""
        echo "Step 2: Deploy Frontend to Vercel"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up with GitHub"
        echo "3. Import your repository"
        echo "4. Set Root Directory to 'client'"
        echo "5. Set environment variables:"
        echo "   - NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app"
        echo "   - NEXTAUTH_URL=https://your-vercel-app.vercel.app"
        echo "   - NEXTAUTH_SECRET=your-secret-key"
        echo "   - GOOGLE_CLIENT_ID=your-google-client-id"
        echo "   - GOOGLE_CLIENT_SECRET=your-google-client-secret"
        ;;
    2)
        echo "🚀 Setting up Render deployment..."
        echo ""
        echo "1. Go to https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Create Web Service from GitHub"
        echo "4. Add PostgreSQL database"
        echo "5. Set environment variables:"
        echo "   - DATABASE_URL (from PostgreSQL service)"
        echo "   - JWT_SECRET=your-secret-key"
        echo "   - GOOGLE_CLIENT_ID=your-google-client-id"
        echo "   - GOOGLE_CLIENT_SECRET=your-google-client-secret"
        echo "   - YOUTUBE_API_KEY=your-youtube-api-key"
        echo "   - NODE_ENV=production"
        echo "   - NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com"
        echo "   - NEXTAUTH_URL=https://your-render-app.onrender.com"
        echo "   - NEXTAUTH_SECRET=your-secret-key"
        ;;
    3)
        echo "🚀 Setting up Vercel full-stack deployment..."
        echo ""
        echo "Note: This requires moving the server code to API routes"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up with GitHub"
        echo "3. Import your repository"
        echo "4. Set environment variables:"
        echo "   - DATABASE_URL=your-database-url"
        echo "   - JWT_SECRET=your-secret-key"
        echo "   - GOOGLE_CLIENT_ID=your-google-client-id"
        echo "   - GOOGLE_CLIENT_SECRET=your-google-client-secret"
        echo "   - YOUTUBE_API_KEY=your-youtube-api-key"
        echo "   - NEXTAUTH_SECRET=your-secret-key"
        ;;
    4)
        echo "📖 Opening deployment guide..."
        if [ -f "DEPLOYMENT.md" ]; then
            cat DEPLOYMENT.md
        else
            echo "❌ Deployment guide not found. Please check DEPLOYMENT.md"
        fi
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

echo ""
echo "🔧 Additional steps:"
echo "1. Update Google OAuth redirect URIs in Google Cloud Console"
echo "2. Run database migrations on your hosting platform"
echo "3. Test your deployed application"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🆘 Need help? Check the troubleshooting section in DEPLOYMENT.md"
