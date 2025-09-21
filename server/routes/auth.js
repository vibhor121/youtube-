const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/database');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    // Verify Google token (handle both idToken and accessToken)
    let payload;
    try {
      // First try as idToken
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (idTokenError) {
      // If idToken fails, try as accessToken by fetching user info
      try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        payload = await response.json();
        payload.sub = payload.id; // Map id to sub for consistency
      } catch (accessTokenError) {
        throw new Error('Invalid Google token');
      }
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email is required' 
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name,
          accessToken: token, // Store the Google access token as YouTube access token
          refreshToken: null
        }
      });
    } else {
      // Update user info and access token
      user = await prisma.user.update({
        where: { googleId },
        data: {
          email,
          name,
          accessToken: token // Update with new access token
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
