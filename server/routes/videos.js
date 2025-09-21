const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/database');
const YouTubeService = require('../lib/youtube');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);

// Get all videos for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            comments: true,
            notes: true
          }
        }
      }
    });

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch videos' 
    });
  }
});

// Get specific video details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    
    const video = await prisma.video.findFirst({
      where: { 
        id: videoId,
        userId: req.user.id 
      },
      include: {
        _count: {
          select: {
            comments: true,
            notes: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Video not found' 
      });
    }

    // Fetch fresh data from YouTube API
    try {
      const youtubeData = await youtubeService.getVideoDetails(video.youtubeVideoId);
      
      // Update local database with fresh data
      await prisma.video.update({
        where: { id: videoId },
        data: {
          title: youtubeData.snippet.title,
          description: youtubeData.snippet.description,
          thumbnailUrl: youtubeData.snippet.thumbnails?.high?.url,
          viewCount: parseInt(youtubeData.statistics.viewCount || 0),
          likeCount: parseInt(youtubeData.statistics.likeCount || 0),
          commentCount: parseInt(youtubeData.statistics.commentCount || 0),
          youtubeMetadata: youtubeData
        }
      });

      // Return updated video data
      const updatedVideo = await prisma.video.findUnique({
        where: { id: videoId },
        include: {
          _count: {
            select: {
              comments: true,
              notes: true
            }
          }
        }
      });

      res.json({
        success: true,
        video: updatedVideo
      });
    } catch (youtubeError) {
      console.error('YouTube API error:', youtubeError);
      // Return cached data if YouTube API fails
      res.json({
        success: true,
        video,
        warning: 'Using cached data - YouTube API unavailable'
      });
    }

  } catch (error) {
    console.error('Error fetching video details:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch video details' 
    });
  }
});

// Add video to dashboard (sync from YouTube)
router.post('/sync', authenticateToken, [
  body('youtubeVideoId').notEmpty().withMessage('YouTube video ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const { youtubeVideoId } = req.body;

    // Check if video already exists
    const existingVideo = await prisma.video.findUnique({
      where: { youtubeVideoId }
    });

    if (existingVideo) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'Video already exists in dashboard' 
      });
    }

    // Fetch video details from YouTube
    const youtubeData = await youtubeService.getVideoDetails(youtubeVideoId);

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: req.user.id,
        youtubeVideoId,
        title: youtubeData.snippet.title,
        description: youtubeData.snippet.description,
        thumbnailUrl: youtubeData.snippet.thumbnails?.high?.url,
        viewCount: parseInt(youtubeData.statistics.viewCount || 0),
        likeCount: parseInt(youtubeData.statistics.likeCount || 0),
        commentCount: parseInt(youtubeData.statistics.commentCount || 0),
        publishedAt: new Date(youtubeData.snippet.publishedAt),
        youtubeMetadata: youtubeData
      }
    });

    res.status(201).json({
      success: true,
      video,
      message: 'Video synced successfully'
    });

  } catch (error) {
    console.error('Error syncing video:', error);
    if (error.message === 'Video not found') {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Video not found on YouTube' 
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to sync video' 
    });
  }
});

// Update video details
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 500 }).withMessage('Title must be 1-500 characters'),
  body('description').optional().isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const videoId = parseInt(req.params.id);
    const { title, description } = req.body;

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

    // Update local database only (no YouTube API call)
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: updateData
    });

    res.json({
      success: true,
      video: updatedVideo,
      message: 'Video updated successfully'
    });

  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to update video' 
    });
  }
});

// Remove video from dashboard
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

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

    // Delete video and all related data (cascade)
    await prisma.video.delete({
      where: { id: videoId }
    });

    res.json({
      success: true,
      message: 'Video removed from dashboard'
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to delete video' 
    });
  }
});

module.exports = router;

