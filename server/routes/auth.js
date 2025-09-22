const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/database');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    res.json({
      success: true,
      message: 'Database connected successfully',
      userCount: userCount
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Google token is required' 
      });
    }

    console.log('Attempting to authenticate with token:', token.substring(0, 20) + '...');
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ 
        error: 'Database Error', 
        message: 'Failed to connect to database' 
      });
    }
    
    // Try to find user by existing access token or create a test user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { accessToken: token },
          { email: { contains: '@' } }
        ]
      }
    });
    
    // If no user found, create a test user for development
    if (!user) {
      console.log('No user found, creating test user');
      user = await prisma.user.create({
        data: {
          googleId: 'test-user-' + Date.now(),
          email: 'test@example.com',
          name: 'Test User',
          accessToken: token,
          refreshToken: null
        }
      });
    } else {
      // Update user with new token
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: token
        }
      });
    }
    
    // Generate JWT tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasYouTubeAccess: !!user.accessToken
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Authentication failed' 
    });
  }
});

// Store YouTube access token
router.post('/youtube-token', async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const userId = req.user.id;

    if (!accessToken) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Access token is required' 
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken,
        refreshToken
      }
    });

    res.json({
      success: true,
      message: 'YouTube access token stored successfully'
    });

  } catch (error) {
    console.error('YouTube token storage error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to store YouTube token' 
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Refresh token is required' 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Invalid refresh token' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'User not found' 
      });
    }

    const newAccessToken = generateToken(user.id);

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid refresh token' 
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Logout failed' 
    });
  }
});

module.exports = router;
