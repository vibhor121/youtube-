#!/bin/bash

# 🔧 Environment Setup Script for Deployment
# This script helps you set up environment variables for deployment

echo "🔧 YouTube Companion Dashboard - Environment Setup"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 This script will help you set up environment variables for deployment."
echo ""

# Function to generate random secret
generate_secret() {
    openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64
}

echo "🔐 Generating secure secrets..."
JWT_SECRET=$(generate_secret)
NEXTAUTH_SECRET=$(generate_secret)

echo "✅ Generated JWT_SECRET: $JWT_SECRET"
echo "✅ Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

echo "📝 Environment Variables for Deployment:"
echo "========================================"
echo ""
echo "🔧 Backend Environment Variables (Railway/Render):"
echo "DATABASE_URL=postgresql://username:password@host:port/database"
echo "JWT_SECRET=$JWT_SECRET"
echo "GOOGLE_CLIENT_ID=your-google-client-id"
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret"
echo "YOUTUBE_API_KEY=your-youtube-api-key"
echo "NODE_ENV=production"
echo ""
echo "🌐 Frontend Environment Variables (Vercel):"
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.com"
echo "NEXTAUTH_URL=https://your-frontend-url.com"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "GOOGLE_CLIENT_ID=your-google-client-id"
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret"
echo ""

echo "📋 Google OAuth Setup:"
echo "====================="
echo "1. Go to https://console.cloud.google.com"
echo "2. Navigate to APIs & Services → Credentials"
echo "3. Edit your OAuth 2.0 Client ID"
echo "4. Add these Authorized Redirect URIs:"
echo "   - http://localhost:3000/api/auth/callback/google (for local development)"
echo "   - https://your-frontend-url.com/api/auth/callback/google (for production)"
echo "5. Add these Authorized JavaScript Origins:"
echo "   - http://localhost:3000 (for local development)"
echo "   - https://your-frontend-url.com (for production)"
echo ""

echo "🗄️ Database Setup:"
echo "=================="
echo "1. Create a PostgreSQL database on your hosting platform"
echo "2. Copy the connection string to DATABASE_URL"
echo "3. Run migrations: npx prisma migrate deploy"
echo ""

echo "🚀 Quick Deployment Commands:"
echo "============================="
echo ""
echo "For Railway (Backend):"
echo "npm install -g @railway/cli"
echo "railway login"
echo "railway link"
echo "railway up"
echo ""
echo "For Vercel (Frontend):"
echo "npm install -g vercel"
echo "vercel login"
echo "vercel --prod"
echo ""

echo "✅ Setup complete! Copy the environment variables above to your hosting platform."
echo "📚 For detailed instructions, see DEPLOYMENT.md"
