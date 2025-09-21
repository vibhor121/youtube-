#!/bin/bash

echo "🚀 Setting up YouTube Companion Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

echo "🗄️ Setting up database..."

# Create database (you may need to adjust the connection details)
echo "Please create a PostgreSQL database named 'youtube_dashboard' and update the DATABASE_URL in server/.env"

echo "📝 Setting up environment files..."

# Copy environment files
cp server/env.example server/.env
cp client/env.example client/.env.local

echo "🔧 Generating Prisma client..."
cd server
npx prisma generate
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your database connection details"
echo "2. Update client/.env.local with your Google OAuth credentials"
echo "3. Get a YouTube API key and add it to server/.env"
echo "4. Run database migrations: cd server && npx prisma migrate dev"
echo "5. Start the development servers: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"

