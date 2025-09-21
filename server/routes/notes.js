const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get notes for a video
router.get('/video/:videoId', authenticateToken, async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId);

    // Check if video exists and belongs to user
    const video = await prisma.video.findFirst({
      where: { 
        id: videoId,
        userId: req.user.id 
      }
    });

    if (!video) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Video not found' 
      });
    }

    const notes = await prisma.note.findMany({
      where: { 
        videoId,
        userId: req.user.id 
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      notes,
      totalCount: notes.length
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch notes' 
    });
  }
});

// Create a new note
router.post('/', authenticateToken, [
  body('videoId').isInt().withMessage('Video ID must be a number'),
  body('title').notEmpty().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be 1-255 characters'),
  body('content').notEmpty().isLength({ min: 1, max: 5000 }).withMessage('Content is required and must be 1-5000 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const { videoId, title, content, category, priority = 1 } = req.body;

    // Check if video exists and belongs to user
    const video = await prisma.video.findFirst({
      where: { 
        id: videoId,
        userId: req.user.id 
      }
    });

    if (!video) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Video not found' 
      });
    }

    const note = await prisma.note.create({
      data: {
        videoId,
        userId: req.user.id,
        title,
        content,
        category,
        priority
      }
    });

    res.status(201).json({
      success: true,
      note,
      message: 'Note created successfully'
    });

  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to create note' 
    });
  }
});

// Update a note
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('Title must be 1-255 characters'),
  body('content').optional().isLength({ min: 1, max: 5000 }).withMessage('Content must be 1-5000 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const noteId = parseInt(req.params.id);
    const updates = req.body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { 
        id: noteId,
        userId: req.user.id 
      }
    });

    if (!existingNote) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Note not found' 
      });
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: updates
    });

    res.json({
      success: true,
      note,
      message: 'Note updated successfully'
    });

  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to update note' 
    });
  }
});

// Delete a note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);

    // Check if note exists and belongs to user
    const note = await prisma.note.findFirst({
      where: { 
        id: noteId,
        userId: req.user.id 
      }
    });

    if (!note) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Note not found' 
      });
    }

    await prisma.note.delete({
      where: { id: noteId }
    });

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to delete note' 
    });
  }
});

// Get notes by category
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const notes = await prisma.note.findMany({
      where: { 
        category,
        userId 
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            youtubeVideoId: true,
            thumbnailUrl: true
          }
        }
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      notes,
      totalCount: notes.length
    });

  } catch (error) {
    console.error('Error fetching notes by category:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch notes by category' 
    });
  }
});

// Search notes
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: searchQuery, videoId } = req.query;
    const userId = req.user.id;

    if (!searchQuery) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Search query is required' 
      });
    }

    const whereClause = {
      userId,
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } }
      ]
    };

    if (videoId) {
      whereClause.videoId = parseInt(videoId);
    }

    const notes = await prisma.note.findMany({
      where: whereClause,
      include: {
        video: {
          select: {
            id: true,
            title: true,
            youtubeVideoId: true,
            thumbnailUrl: true
          }
        }
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      notes,
      totalCount: notes.length,
      searchQuery
    });

  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to search notes' 
    });
  }
});

module.exports = router;

