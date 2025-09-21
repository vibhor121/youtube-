'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCompactNumber, formatDate } from '@/lib/utils'
import { Play, MessageSquare, FileText, Eye, ThumbsUp } from 'lucide-react'
import Image from 'next/image'

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

interface VideoGridProps {
  videos: Video[]
  selectedVideo: Video | null
  onSelectVideo: (video: Video) => void
}

export function VideoGrid({ videos, selectedVideo, onSelectVideo }: VideoGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Your Videos</h2>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedVideo?.id === video.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectVideo(video)}
          >
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="relative flex-shrink-0">
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={120}
                      height={68}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-30 h-17 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {video.publishedAt ? formatDate(video.publishedAt) : 'Unknown'}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      {formatCompactNumber(video.viewCount)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      {formatCompactNumber(video.likeCount)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {formatCompactNumber(video.commentCount)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <FileText className="mr-1 h-3 w-3" />
                      {video._count.notes} notes
                    </Badge>
                  </div>
                  
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

