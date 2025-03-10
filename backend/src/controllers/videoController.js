// backend/src/controllers/videoController.js
import InterviewResponse from '../models/InterviewResponse.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import * as cloudinaryService from '../services/cloudinaryService.js';
import AIServiceClient from '../services/aiServiceClient.js';

/**
 * Start a new interview session for a candidate
 * @route POST /api/videos/start-interview
 * @access Private
 */
export const startInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    // Check if interview exists and has questions
    const questionsCount = await InterviewQuestion.countDocuments({
      interview: interviewId,
    });

    if (questionsCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'This interview has no questions',
      });
    }

    // Create a new interview response record
    const interviewResponse = await InterviewResponse.create({
      candidate: req.user.id,
      interview: interviewId,
      status: 'in_progress',
      startTime: new Date(),
      responses: [], // Will be populated as candidate answers questions
    });

    res.status(201).json({
      success: true,
      data: {
        interviewResponseId: interviewResponse._id,
        status: interviewResponse.status,
      },
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message,
    });
  }
};

/**
 * Upload video response for a specific question
 * @route POST /api/videos/upload
 * @access Private
 */
export const uploadVideoResponse = async (req, res) => {
  try {
    const { interviewResponseId, questionId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded',
      });
    }

    // Find the interview response record
    const interviewResponse = await InterviewResponse.findById(interviewResponseId);

    if (!interviewResponse) {
      return res.status(404).json({
        success: false,
        message: 'Interview response not found',
      });
    }

    // Check if user is authorized (is the candidate)
    if (interviewResponse.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload to this interview',
      });
    }

    // Upload video to Cloudinary
    const uploadResult = await cloudinaryService.uploadVideo(
      req.file.path,
      `interview-videos/${interviewResponseId}`
    );

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload video to cloud storage',
        error: uploadResult.error,
      });
    }

    // Create or update response for this question
    const existingResponseIndex = interviewResponse.responses.findIndex(
      (r) => r.question.toString() === questionId
    );

    const responseData = {
      question: questionId,
      videoUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      duration: uploadResult.duration,
      uploadStatus: 'completed',
      uploadProgress: 100,
    };

    if (existingResponseIndex >= 0) {
      // Update existing response
      interviewResponse.responses[existingResponseIndex] = {
        ...interviewResponse.responses[existingResponseIndex].toObject(),
        ...responseData,
      };
    } else {
      // Add new response
      interviewResponse.responses.push(responseData);
    }

    await interviewResponse.save();

    // Trigger async transcription process
    processVideoAsync(interviewResponseId, questionId, uploadResult.url);

    res.status(200).json({
      success: true,
      data: {
        videoUrl: uploadResult.url,
        duration: uploadResult.duration,
      },
    });
  } catch (error) {
    console.error('Upload video response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video response',
      error: error.message,
    });
  }
};

/**
 * Complete an interview session
 * @route POST /api/videos/complete-interview
 * @access Private
 */
export const completeInterview = async (req, res) => {
  try {
    const { interviewResponseId } = req.body;

    // Find and update the interview response
    const interviewResponse = await InterviewResponse.findById(interviewResponseId);

    if (!interviewResponse) {
      return res.status(404).json({
        success: false,
        message: 'Interview response not found',
      });
    }

    // Check if user is authorized (is the candidate)
    if (interviewResponse.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this interview',
      });
    }

    // Update status and end time
    interviewResponse.status = 'completed';
    interviewResponse.endTime = new Date();
    await interviewResponse.save();

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      data: {
        interviewResponseId: interviewResponse._id,
        status: interviewResponse.status,
      },
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: error.message,
    });
  }
};

/**
 * Get interview response status
 * @route GET /api/videos/status/:interviewResponseId
 * @access Private
 */
export const getInterviewStatus = async (req, res) => {
  try {
    const { interviewResponseId } = req.params;

    // Find the interview response with populated questions
    const interviewResponse = await InterviewResponse.findById(interviewResponseId)
      .populate({
        path: 'responses.question',
        model: 'InterviewQuestion',
      });

    if (!interviewResponse) {
      return res.status(404).json({
        success: false,
        message: 'Interview response not found',
      });
    }

    // Check if user is authorized (is the candidate or interview creator)
    if (
      interviewResponse.candidate.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview response',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: interviewResponse.status,
        startTime: interviewResponse.startTime,
        endTime: interviewResponse.endTime,
        responses: interviewResponse.responses.map(r => ({
          questionId: r.question._id,
          questionText: r.question.text,
          uploadStatus: r.uploadStatus,
          uploadProgress: r.uploadProgress,
          videoUrl: r.videoUrl,
          duration: r.duration,
          hasTranscription: !!r.transcription,
          hasAnalysis: !!r.aiAnalysis,
        })),
      },
    });
  } catch (error) {
    console.error('Get interview status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get interview status',
      error: error.message,
    });
  }
};

/**
 * Process video asynchronously (transcription and analysis)
 * @param {string} interviewResponseId - ID of the interview response
 * @param {string} questionId - ID of the question
 * @param {string} videoUrl - URL of the uploaded video
 */
const processVideoAsync = async (interviewResponseId, questionId, videoUrl) => {
  try {
    // Get the interview response
    const interviewResponse = await InterviewResponse.findById(interviewResponseId);
    const responseIndex = interviewResponse.responses.findIndex(
      (r) => r.question.toString() === questionId
    );

    if (responseIndex === -1) return;

    // Step 1: Transcribe the video
    const transcriptionResult = await AIServiceClient.transcribeVideo(videoUrl);

    if (transcriptionResult.success) {
      // Update the response with transcription
      interviewResponse.responses[responseIndex].transcription = 
        transcriptionResult.transcription;
      await interviewResponse.save();

      // Step 2: Get the question text for analysis
      const question = await InterviewQuestion.findById(questionId);
      
      if (question) {
        // Step 3: Analyze the answer
        const analysisResult = await AIServiceClient.analyzeAnswer({
          questionText: question.text,
          answerText: transcriptionResult.transcription,
          category: question.category,
        });

        if (analysisResult.success) {
          // Update the response with analysis
          interviewResponse.responses[responseIndex].aiAnalysis = analysisResult.analysis;
          await interviewResponse.save();
        }
      }
    }
  } catch (error) {
    console.error('Process video async error:', error);
  }
};