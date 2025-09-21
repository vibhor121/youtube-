# YouTube Companion Dashboard

A comprehensive dashboard for managing YouTube videos with advanced features including comment management, video updates, and personal notes.

## Features

- 🎥 **Video Management**: Upload and manage unlisted YouTube videos
- 💬 **Comment System**: View, add, reply to, and delete comments
- ✏️ **Video Updates**: Change video title and description
- 📝 **Notes System**: Personal notes for video improvement ideas
- 🔐 **Secure Authentication**: Google OAuth 2.0 integration
- 📊 **Real-time Stats**: Live video statistics and engagement metrics

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Google OAuth 2.0
- **APIs**: YouTube Data API v3

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up Environment Variables**
   ```bash
   # Copy environment files
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env
   ```

3. **Set up Database**
   ```bash
   # Start PostgreSQL service
   # Update database connection in server/.env
   cd server && npx prisma migrate dev
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Server (.env)
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/youtube_dashboard
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
```

## Project Structure

```
youtube-companion-dashboard/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
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

- `GET /api/videos` - List user videos
- `GET /api/videos/:id` - Get video details
- `PUT /api/videos/:id` - Update video
- `GET /api/comments/video/:videoId` - Get video comments
- `POST /api/comments` - Add comment
- `POST /api/comments/:id/reply` - Reply to comment
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/notes/video/:videoId` - Get video notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
# youtube-
