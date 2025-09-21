import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  name: string
  hasYouTubeAccess: boolean
}

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

interface Note {
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

interface AppState {
  user: User | null
  videos: Video[]
  selectedVideo: Video | null
  comments: Comment[]
  notes: Note[]
  loading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setVideos: (videos: Video[]) => void
  setSelectedVideo: (video: Video | null) => void
  setComments: (comments: Comment[]) => void
  setNotes: (notes: Note[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addVideo: (video: Video) => void
  updateVideo: (video: Video) => void
  removeVideo: (videoId: number) => void
  addComment: (comment: Comment) => void
  removeComment: (commentId: number) => void
  addNote: (note: Note) => void
  updateNote: (note: Note) => void
  removeNote: (noteId: number) => void
  clearState: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      videos: [],
      selectedVideo: null,
      comments: [],
      notes: [],
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setVideos: (videos) => set({ videos }),
      setSelectedVideo: (video) => set({ selectedVideo: video }),
      setComments: (comments) => set({ comments }),
      setNotes: (notes) => set({ notes }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addVideo: (video) => set((state) => ({ 
        videos: [...state.videos, video] 
      })),
      
      updateVideo: (video) => set((state) => ({
        videos: state.videos.map(v => v.id === video.id ? video : v),
        selectedVideo: state.selectedVideo?.id === video.id ? video : state.selectedVideo
      })),
      
      removeVideo: (videoId) => set((state) => ({
        videos: state.videos.filter(v => v.id !== videoId),
        selectedVideo: state.selectedVideo?.id === videoId ? null : state.selectedVideo
      })),

      addComment: (comment) => set((state) => ({
        comments: [...state.comments, comment]
      })),
      
      removeComment: (commentId) => set((state) => ({
        comments: state.comments.filter(c => c.id !== commentId)
      })),

      addNote: (note) => set((state) => ({
        notes: [...state.notes, note]
      })),
      
      updateNote: (note) => set((state) => ({
        notes: state.notes.map(n => n.id === note.id ? note : n)
      })),
      
      removeNote: (noteId) => set((state) => ({
        notes: state.notes.filter(n => n.id !== noteId)
      })),

      clearState: () => set({
        user: null,
        videos: [],
        selectedVideo: null,
        comments: [],
        notes: [],
        loading: false,
        error: null
      })
    }),
    {
      name: 'youtube-dashboard-storage',
      partialize: (state) => ({
        user: state.user,
        videos: state.videos,
        selectedVideo: state.selectedVideo
      })
    }
  )
)

