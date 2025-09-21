'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatCompactNumber, formatDate } from '@/lib/utils'
import { 
  Play, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  ExternalLink 
} from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Video {
  id: number
  youtubeVideoId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  _count: {
    comments: number
    notes: number
  }
}

interface VideoDetailsProps {
  video: Video
}

export function VideoDetails({ video }: VideoDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        })
      })

      if (response.ok) {
        toast.success('Video updated successfully')
        setIsEditing(false)
        // Refresh the page to get updated data
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update video')
      }
    } catch (error) {
      console.error('Error updating video:', error)
      toast.error('Failed to update video')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTitle(video.title)
    setDescription(video.description || '')
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">Video Details</CardTitle>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video Thumbnail and Basic Info */}
        <div className="flex space-x-4">
          <div className="relative flex-shrink-0">
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={200}
                height={113}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-50 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            {/* Title */}
            {isEditing ? (
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">
                {video.title}
              </h3>
            )}

            {/* Description */}
            {isEditing ? (
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {video.description || 'No description available'}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {formatCompactNumber(video.viewCount)} views
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <ThumbsUp className="mr-1 h-3 w-3" />
                {formatCompactNumber(video.likeCount)} likes
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <MessageSquare className="mr-1 h-3 w-3" />
                {formatCompactNumber(video.commentCount)} comments
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {video.publishedAt ? formatDate(video.publishedAt) : 'Unknown date'}
              </Badge>
            </div>

            {/* YouTube Link */}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://youtube.com/watch?v=${video.youtubeVideoId}`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on YouTube
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

