'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Check,
  X,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

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

interface Video {
  id: number
  youtubeVideoId: string
  title: string
}

interface NotesSectionProps {
  video: Video
}

const PRIORITY_LABELS = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
  5: 'Critical'
}

const PRIORITY_COLORS = {
  1: 'bg-gray-100 text-gray-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700'
}

const CATEGORIES = [
  'Content',
  'SEO',
  'Thumbnail',
  'Title',
  'Description',
  'Tags',
  'Engagement',
  'Technical',
  'Ideas',
  'Other'
]

export function NotesSection({ video }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState(1)

  useEffect(() => {
    loadNotes()
  }, [video.id])

  const loadNotes = async () => {
    try {
      // Get JWT token from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      if (!session?.accessToken) {
        toast.error('Please sign in to view notes')
        return
      }

      // Get JWT token from backend
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      if (!jwtResponse.ok) {
        toast.error('Authentication failed')
        return
      }

      const { accessToken } = await jwtResponse.json()

      const response = await fetch(`/api/notes/video/${video.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
      } else {
        toast.error('Failed to load notes')
      }
    } catch (error) {
      console.error('Error loading notes:', error)
      toast.error('Failed to load notes')
    }
  }

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsLoading(true)
    try {
      // Get JWT token from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      if (!session?.accessToken) {
        toast.error('Please sign in to add notes')
        return
      }

      // Get JWT token from backend
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      if (!jwtResponse.ok) {
        toast.error('Authentication failed')
        return
      }

      const { accessToken } = await jwtResponse.json()

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          videoId: video.id,
          title: title.trim(),
          content: content.trim(),
          category: category || null,
          priority: priority
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNotes([data.note, ...notes])
        resetForm()
        toast.success('Note created successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error('Failed to create note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsLoading(true)
    try {
      // Get JWT token from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      if (!session?.accessToken) {
        toast.error('Please sign in to update notes')
        return
      }

      // Get JWT token from backend
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      if (!jwtResponse.ok) {
        toast.error('Authentication failed')
        return
      }

      const { accessToken } = await jwtResponse.json()

      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category || null,
          priority: priority
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(notes.map(n => n.id === editingNote.id ? data.note : n))
        setEditingNote(null)
        resetForm()
        toast.success('Note updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      // Get JWT token from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      if (!session?.accessToken) {
        toast.error('Please sign in to delete notes')
        return
      }

      // Get JWT token from backend
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      if (!jwtResponse.ok) {
        toast.error('Authentication failed')
        return
      }

      const { accessToken } = await jwtResponse.json()

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
        toast.success('Note deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  const handleToggleComplete = async (note: Note) => {
    try {
      // Get JWT token from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      if (!session?.accessToken) {
        toast.error('Please sign in to update notes')
        return
      }

      // Get JWT token from backend
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      if (!jwtResponse.ok) {
        toast.error('Authentication failed')
        return
      }

      const { accessToken } = await jwtResponse.json()

      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          isCompleted: !note.isCompleted
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(notes.map(n => n.id === note.id ? data.note : n))
        toast.success(note.isCompleted ? 'Note marked as incomplete' : 'Note marked as complete')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setCategory('')
    setPriority(1)
    setIsAdding(false)
    setEditingNote(null)
  }

  const startEdit = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setCategory(note.category || '')
    setPriority(note.priority)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Notes ({notes.length})
          </CardTitle>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add/Edit Note Form */}
        {(isAdding || editingNote) && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-4">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Note content..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                  disabled={isLoading || !title.trim() || !content.trim()}
                >
                  {isLoading ? 'Saving...' : (editingNote ? 'Update' : 'Add')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`border rounded-lg p-4 ${
                note.isCompleted ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-medium ${note.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {note.title}
                    </h4>
                    <Badge className={PRIORITY_COLORS[note.priority as keyof typeof PRIORITY_COLORS]}>
                      {PRIORITY_LABELS[note.priority as keyof typeof PRIORITY_LABELS]}
                    </Badge>
                    {note.category && (
                      <Badge variant="outline">{note.category}</Badge>
                    )}
                  </div>
                  
                  <p className={`text-gray-700 mb-3 ${note.isCompleted ? 'line-through' : ''}`}>
                    {note.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(note.updatedAt)}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(note)}
                      >
                        <Check className={`mr-1 h-3 w-3 ${note.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                        {note.isCompleted ? 'Completed' : 'Mark Complete'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(note)}
                      >
                        <Edit3 className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>
                {searchQuery || selectedCategory 
                  ? 'No notes match your search criteria' 
                  : 'No notes yet. Add your first note to get started!'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

