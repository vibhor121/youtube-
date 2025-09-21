const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/database');
const YouTubeService = require('../lib/youtube');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);

// Get comments for a video
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

    // Fetch comments from database (local only)
    const comments = await prisma.comment.findMany({
      where: { videoId },
      orderBy: { publishedAt: 'desc' }
    });

    res.json({
      success: true,
      comments: comments,
      totalCount: comments.length
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch comments' 
    });
  }
});

// Add comment to video
router.post('/', authenticateToken, [
  body('videoId').isInt().withMessage('Video ID must be a number'),
  body('text').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Comment text is required and must be 1-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const { videoId, text } = req.body;

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

    // Store comment in database (local only - no YouTube API call)
    const comment = await prisma.comment.create({
      data: {
        videoId,
        youtubeCommentId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate local ID
        authorName: req.user.name || 'User',
        authorChannelUrl: '',
        textDisplay: text,
        likeCount: 0,
        publishedAt: new Date(),
        updatedAt: new Date(),
        isReply: false,
        youtubeMetadata: null
      }
    });

    res.status(201).json({
      success: true,
      comment,
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to add comment' 
    });
  }
});

// Reply to comment
router.post('/:commentId/reply', authenticateToken, [
  body('text').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Reply text is required and must be 1-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: errors.array()[0].msg 
      });
    }

    const { commentId } = req.params;
    const { text } = req.body;

    // Check if comment exists and belongs to user's video
    const parentComment = await prisma.comment.findFirst({
      where: { 
        youtubeCommentId: commentId,
        isReply: false
      },
      include: {
        video: true
      }
    });

    if (!parentComment || parentComment.video.userId !== req.user.id) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Comment not found' 
      });
    }

    // Check if user has YouTube access
    if (!req.user.accessToken) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'YouTube access required to reply to comments' 
      });
    }

    // Add reply to YouTube
    const youtubeReply = await youtubeService.replyToComment(
      commentId, 
      text, 
      req.user.accessToken
    );

    // Store reply in database
    const reply = await prisma.comment.create({
      data: {
        videoId: parentComment.videoId,
        youtubeCommentId: youtubeReply.id,
        authorName: youtubeReply.snippet.authorDisplayName,
        authorChannelUrl: youtubeReply.snippet.authorChannelUrl,
        textDisplay: youtubeReply.snippet.textDisplay,
        likeCount: youtubeReply.snippet.likeCount,
        publishedAt: new Date(youtubeReply.snippet.publishedAt),
        updatedAt: new Date(youtubeReply.snippet.updatedAt),
        isReply: true,
        parentCommentId: commentId,
        youtubeMetadata: youtubeReply
      }
    });

    res.status(201).json({
      success: true,
      reply,
      message: 'Reply added successfully'
    });

  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to add reply' 
    });
  }
});

// Delete comment
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists and belongs to user's video
    const comment = await prisma.comment.findFirst({
      where: { 
        youtubeCommentId: commentId
      },
      include: {
        video: true
      }
    });

    if (!comment || comment.video.userId !== req.user.id) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Comment not found' 
      });
    }

    // Check if user has YouTube access
    if (!req.user.accessToken) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'YouTube access required to delete comments' 
      });
    }

    // Delete comment from YouTube
    await youtubeService.deleteComment(commentId, req.user.accessToken);

    // Delete comment from database
    await prisma.comment.delete({
      where: { id: comment.id }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to delete comment' 
    });
  }
});

module.exports = router;

