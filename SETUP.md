# YouTube Companion Dashboard - Setup Guide

This guide will help you set up the YouTube Companion Dashboard on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup

1. **Clone and Install**
   ```bash
   cd /home/vibhor/Downloads/vibhorpersonal/Cactro/21-9-25-a
   chmod +x install.sh
   ./install.sh
   ```

2. **Configure Environment Variables**
   
   **Server Configuration** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/youtube_dashboard?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   YOUTUBE_API_KEY="your-youtube-api-key"
   CORS_ORIGIN="http://localhost:3000"
   ```

   **Client Configuration** (`client/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Set up Database**
   ```bash
   # Create PostgreSQL database
   createdb youtube_dashboard
   
   # Run migrations
   cd server
   npx prisma migrate dev
   ```

4. **Start Development Servers**
   ```bash
   # From project root
   npm run dev
   ```

## Detailed Setup

### 1. Database Setup

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS with Homebrew
   brew install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   sudo -u postgres psql
   
   # Create database and user
   CREATE DATABASE youtube_dashboard;
   CREATE USER youtube_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE youtube_dashboard TO youtube_user;
   \q
   ```

3. **Update Database URL**
   Update the `DATABASE_URL` in `server/.env` with your actual credentials:
   ```env
   DATABASE_URL="postgresql://youtube_user:your_password@localhost:5432/youtube_dashboard?schema=public"
   ```

### 2. Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Enable "Google+ API" and "YouTube Data API v3"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret

4. **Update Environment Variables**
   Add the credentials to both `server/.env` and `client/.env.local`

### 3. YouTube API Setup

1. **Get YouTube API Key**
   - In Google Cloud Console, go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

2. **Update Server Environment**
   Add the API key to `server/.env`:
   ```env
   YOUTUBE_API_KEY=your-youtube-api-key
   ```

### 4. JWT Secret Setup

Generate a secure JWT secret:
```bash
# Generate random string
openssl rand -base64 32
```

Add to both `server/.env` and `client/.env.local`:
```env
JWT_SECRET=your-generated-secret-here
NEXTAUTH_SECRET=your-generated-secret-here
```

## Running the Application

### Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run client:dev  # Frontend only (port 3000)
npm run server:dev  # Backend only (port 5000)
```

### Production Mode

```bash
# Build the application
npm run build

# Start production servers
npm start
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## Features Overview

### 🎥 Video Management
- Sync unlisted YouTube videos to dashboard
- View real-time video statistics
- Update video titles and descriptions
- Remove videos from dashboard

### 💬 Comment System
- View all video comments
- Add new comments
- Reply to existing comments
- Delete your own comments
- Real-time comment refresh

### 📝 Notes System
- Create personal notes for each video
- Categorize notes (Content, SEO, Thumbnail, etc.)
- Set priority levels (Low to Critical)
- Mark notes as complete/incomplete
- Search and filter notes

### 🔐 Authentication
- Google OAuth 2.0 integration
- Secure JWT token management
- Automatic token refresh

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify database credentials in `.env`
   - Ensure database exists: `psql -l | grep youtube_dashboard`

2. **Google OAuth Error**
   - Verify redirect URI matches exactly
   - Check client ID and secret are correct
   - Ensure APIs are enabled in Google Cloud Console

3. **YouTube API Error**
   - Verify API key is valid
   - Check YouTube Data API v3 is enabled
   - Ensure API quotas are not exceeded

4. **Port Already in Use**
   - Change ports in environment files
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

### Logs and Debugging

- **Backend logs**: Check terminal running `npm run server:dev`
- **Frontend logs**: Check browser console and terminal running `npm run client:dev`
- **Database logs**: Check PostgreSQL logs

## Project Structure

```
youtube-companion-dashboard/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and configurations
│   └── types/            # TypeScript types
├── server/               # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
└── shared/              # Shared types and utilities
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/youtube-token` - Store YouTube access token
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Videos
- `GET /api/videos` - List user videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/sync` - Sync video from YouTube
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Remove video

### Comments
- `GET /api/comments/video/:videoId` - Get video comments
- `POST /api/comments` - Add comment
- `POST /api/comments/:id/reply` - Reply to comment
- `DELETE /api/comments/:id` - Delete comment

### Notes
- `GET /api/notes/video/:videoId` - Get video notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search` - Search notes

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all environment variables are set correctly
4. Verify all dependencies are installed

## License

MIT License - see LICENSE file for details
