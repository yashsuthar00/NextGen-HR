import axios from 'axios';

// Base URL for AI service API from environment variables
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-services:5000';

/**
 * Client for communicating with the AI microservice
 */
class AIServiceClient {
  /**
   * Extract text from a video using the AI service
   * @param {string} videoUrl - URL of the video to transcribe
   * @returns {Promise<Object>} - Transcription result
   */
  static async transcribeVideo(videoUrl) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/speech-to-text`,
        {
          videoUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return {
        success: true,
        transcription: response.data.transcription,
        confidence: response.data.confidence,
      };
    } catch (error) {
      console.error('AI service transcription error:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Analyze an interview answer using the AI service
   * @param {Object} data - Analysis request data
   * @param {string} data.questionText - The interview question text
   * @param {string} data.answerText - The transcribed answer text
   * @param {string} data.category - Question category (optional)
   * @returns {Promise<Object>} - Analysis result
   */
  static async analyzeAnswer(data) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/analyze-answer`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return {
        success: true,
        analysis: response.data,
      };
    } catch (error) {
      console.error('AI service analysis error:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Check health status of the AI service
   * @returns {Promise<boolean>} - True if service is healthy
   */
  static async checkHealth() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/health`, {
        timeout: 5000, // 5 seconds timeout
      });
      return response.status === 200;
    } catch (error) {
      console.error('AI service health check failed:', error.message);
      return false;
    }
  }
}

export default AIServiceClient;