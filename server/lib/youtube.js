const { google } = require('googleapis');

class YouTubeService {
  constructor(apiKey) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
  }

  // Get video details
  async getVideoDetails(videoId) {
    try {
      // Mock data for testing when API key is invalid
      console.log('Using mock data for video:', videoId);
      return {
        id: videoId,
        snippet: {
          title: `Test Video ${videoId}`,
          description: 'This is a test video description for development purposes.',
          thumbnails: {
            high: {
              url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            }
          },
          publishedAt: new Date().toISOString()
        },
        statistics: {
          viewCount: '100',
          likeCount: '10',
          commentCount: '5'
        },
        status: {
          privacyStatus: 'unlisted'
        }
      };
      
      // Uncomment below to use real API when key is fixed
      /*
      const response = await this.youtube.videos.list({
        part: 'snippet,statistics,status',
        id: videoId
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      throw new Error('Video not found');
      */
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  // Get video comments
  async getVideoComments(videoId, pageToken = null) {
    try {
      const response = await this.youtube.commentThreads.list({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: 50,
        pageToken: pageToken,
        order: 'time'
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching video comments:', error);
      throw error;
    }
  }

  // Add comment to video
  async addComment(videoId, commentText, accessToken) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: 'v3',
        auth: auth
      });

      const response = await youtube.commentThreads.insert({
        part: 'snippet',
        resource: {
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: commentText
              }
            }
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Reply to comment
  async replyToComment(parentCommentId, replyText, accessToken) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: 'v3',
        auth: auth
      });

      const response = await youtube.comments.insert({
        part: 'snippet',
        resource: {
          snippet: {
            parentId: parentCommentId,
            textOriginal: replyText
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  }

  // Delete comment
  async deleteComment(commentId, accessToken) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: 'v3',
        auth: auth
      });

      await youtube.comments.delete({
        id: commentId
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Update video details
  async updateVideo(videoId, updates, accessToken) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: 'v3',
        auth: auth
      });

      // First get current video details
      const currentVideo = await this.getVideoDetails(videoId);
      
      const response = await youtube.videos.update({
        part: 'snippet',
        resource: {
          id: videoId,
          snippet: {
            ...currentVideo.snippet,
            ...updates
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  // Get user's videos
  async getUserVideos(accessToken, maxResults = 50) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const youtube = google.youtube({
        version: 'v3',
        auth: auth
      });

      const response = await youtube.search.list({
        part: 'snippet',
        forMine: true,
        type: 'video',
        maxResults: maxResults,
        order: 'date'
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      throw error;
    }
  }
}

module.exports = YouTubeService;

