'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { VideoGrid } from '@/components/dashboard/VideoGrid'
import { VideoDetails } from '@/components/dashboard/VideoDetails'
import { CommentsSection } from '@/components/dashboard/CommentsSection'
import { NotesSection } from '@/components/dashboard/NotesSection'
import { SyncVideoDialog } from '@/components/dashboard/SyncVideoDialog'
import { Button } from '@/components/ui/button'
import { Plus, Youtube } from 'lucide-react'
import { useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { user, videos, selectedVideo, setUser, setVideos, setSelectedVideo } = useAppStore()
  const [showSyncDialog, setShowSyncDialog] = useState(false)
  const [jwtToken, setJwtToken] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }

    // Set user data
    if (session.user && !user) {
      setUser({
        id: 0, // Will be set by backend
        email: session.user.email || '',
        name: session.user.name || '',
        hasYouTubeAccess: false
      })
    }

    // Get JWT token for API calls
    getJwtToken()
  }, [session, status, router, user, setUser])

  const getJwtToken = async () => {
    try {
      const response = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setJwtToken(data.accessToken)
        // Load videos after getting the token
        loadVideos(data.accessToken)
      } else {
        console.error('Failed to get JWT token:', response.status)
      }
    } catch (error) {
      console.error('Error getting JWT token:', error)
    }
  }

  const loadVideos = async (token?: string) => {
    try {
      const response = await fetch('/api/videos', {
        headers: {
          'Authorization': `Bearer ${token || jwtToken || ''}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      } else {
        console.error('Failed to load videos:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading videos:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
            <p className="text-gray-600 mt-2">
              Manage your YouTube videos, comments, and notes
            </p>
          </div>
          <Button onClick={() => setShowSyncDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Sync Video
          </Button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
            <p className="text-gray-600 mb-6">
              Upload a video to YouTube and sync it here to get started
            </p>
            <Button onClick={() => setShowSyncDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Sync Your First Video
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <VideoGrid 
                videos={videos}
                selectedVideo={selectedVideo}
                onSelectVideo={setSelectedVideo}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedVideo ? (
                <div className="space-y-6">
                  <VideoDetails video={selectedVideo} />
                  <CommentsSection video={selectedVideo} />
                  <NotesSection video={selectedVideo} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a video</h3>
                  <p className="text-gray-600">
                    Choose a video from the list to view details, comments, and notes
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SyncVideoDialog 
        open={showSyncDialog}
        onOpenChange={setShowSyncDialog}
        onVideoSynced={() => loadVideos()}
        jwtToken={jwtToken}
      />
    </div>
  )
}

