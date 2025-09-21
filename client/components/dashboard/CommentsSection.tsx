'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Trash2, 
  RefreshCw,
  User,
  ThumbsUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Comment {
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

interface Video {
  id: number
  youtubeVideoId: string
  title: string
}

interface CommentsSectionProps {
  video: Video
}

export function CommentsSection({ video }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadComments()
  }, [video.id])

  const loadComments = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/comments/video/${video.id}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      } else {
        toast.error('Failed to load comments')
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          text: newComment.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setComments([data.comment, ...comments])
        setNewComment('')
        toast.success('Comment added successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReply = async (parentCommentId: string) => {
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/comments/${parentCommentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: replyText.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setComments([...comments, data.reply])
        setReplyText('')
        setReplyingTo(null)
        toast.success('Reply added successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error('Failed to add reply')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(c => c.youtubeCommentId !== commentId))
        toast.success('Comment deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const topLevelComments = comments.filter(c => !c.isReply)
  const replies = comments.filter(c => c.isReply)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadComments}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={isLoading || !newComment.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">{comment.authorName}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(comment.publishedAt || comment.createdAt)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.textDisplay}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      {comment.likeCount}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.youtubeCommentId ? null : comment.youtubeCommentId)}
                    >
                      <Reply className="mr-1 h-3 w-3" />
                      Reply
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.youtubeCommentId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.youtubeCommentId && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.youtubeCommentId)}
                          disabled={isLoading || !replyText.trim()}
                        >
                          {isLoading ? 'Replying...' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {replies
                    .filter(reply => reply.parentCommentId === comment.youtubeCommentId)
                    .map((reply) => (
                      <div key={reply.id} className="ml-6 mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="font-medium text-sm">{reply.authorName}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(reply.publishedAt || reply.createdAt)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.textDisplay}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {reply.likeCount}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(reply.youtubeCommentId)}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}

          {topLevelComments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

