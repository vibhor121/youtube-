'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Youtube, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface SyncVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVideoSynced: () => void
  jwtToken?: string | null
}

export function SyncVideoDialog({ open, onOpenChange, onVideoSynced, jwtToken }: SyncVideoDialogProps) {
  const [youtubeVideoId, setYoutubeVideoId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<any>(null)
  const [error, setError] = useState('')

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleInputChange = (value: string) => {
    setYoutubeVideoId(value)
    setError('')
    setVideoPreview(null)
    
    const videoId = extractVideoId(value)
    if (videoId && videoId.length === 11) {
      // Preview the video
      setVideoPreview({
        id: videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      })
    }
  }

  const handleSync = async () => {
    const videoId = extractVideoId(youtubeVideoId)
    
    if (!videoId) {
      setError('Please enter a valid YouTube video URL or ID')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/videos/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken || ''}`,
        },
        body: JSON.stringify({
          youtubeVideoId: videoId
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Video synced successfully!')
        onVideoSynced()
        onOpenChange(false)
        setYoutubeVideoId('')
        setVideoPreview(null)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to sync video')
      }
    } catch (error) {
      console.error('Error syncing video:', error)
      setError('Failed to sync video. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setYoutubeVideoId('')
    setVideoPreview(null)
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Youtube className="mr-2 h-5 w-5 text-red-600" />
            Sync YouTube Video
          </DialogTitle>
          <DialogDescription>
            Add an existing YouTube video to your dashboard. You can paste the video URL or just the video ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url">YouTube Video URL or ID</Label>
            <Input
              id="video-url"
              placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
              value={youtubeVideoId}
              onChange={(e) => handleInputChange(e.target.value)}
              className="mt-1"
            />
            {error && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {videoPreview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Video Found</span>
              </div>
              <div className="flex space-x-3">
                <img
                  src={videoPreview.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Video ID: {videoPreview.id}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://youtube.com/watch?v=${videoPreview.id}`, '_blank')}
                    className="mt-1"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View on YouTube
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to sync a video:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Upload your video to YouTube as unlisted</li>
              <li>2. Copy the video URL or ID</li>
              <li>3. Paste it here and click "Sync Video"</li>
            </ol>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSync}
              disabled={isLoading || !videoPreview}
            >
              {isLoading ? 'Syncing...' : 'Sync Video'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

