export interface User {
  id: number
  email: string
  name: string
  hasYouTubeAccess: boolean
}

export interface Video {
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

export interface Comment {
  id: number
  youtubeCommentId: string
  authorName: string
  authorChannelUrl: string | null
  textDisplay: string
  likeCount: number
  publishedAt: string | null
  updatedAt: string | null
  isReply: boolean
  parentCommentId: string | null
  createdAt: string
}

export interface Note {
  id: number
  videoId: number
  userId: number
  title: string
  content: string
  category: string | null
  priority: number
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface VideoSyncRequest {
  youtubeVideoId: string
}

export interface CommentRequest {
  videoId: number
  text: string
}

export interface ReplyRequest {
  text: string
}

export interface NoteRequest {
  videoId: number
  title: string
  content: string
  category?: string
  priority?: number
}

export interface VideoUpdateRequest {
  title?: string
  description?: string
}

