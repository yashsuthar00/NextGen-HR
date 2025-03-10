// backend/src/controllers/interviewController.js
import Interview from '../models/Interview.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewResponse from '../models/InterviewResponse.js';

/**
 * Create a new interview with questions
 * @route POST /api/interviews
 * @access Private
 */
export const createInterview = async (req, res) => {
  try {
    const { title, description, jobPosition, timeLimit, questions } = req.body;

    // Create the interview
    const interview = await Interview.create({
      title,
      description,
      jobPosition,
      timeLimit,
      createdBy: req.user.id,
    });

    // Create questions with proper ordering
    if (questions && Array.isArray(questions)) {
      const createdQuestions = await Promise.all(
        questions.map(async (q, index) => {
          return await InterviewQuestion.create({
            text: q.text,
            orderIndex: index,
            timeLimit: q.timeLimit,
            category: q.category,
            interview: interview._id,
          });
        })
      );

      // Update interview with question IDs
      interview.questions = createdQuestions.map((q) => q._id);
      await interview.save();
    }

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create interview',
      error: error.message,
    });
  }
};

/**
 * Get all interviews (with optional filters)
 * @route GET /api/interviews
 * @access Private
 */
export const getInterviews = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter object
    const filter = { createdBy: req.user.id };
    if (status) {
      filter.status = status;
    }

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve interviews',
      error: error.message,
    });
  }
};

/**
 * Get a single interview with questions
 * @route GET /api/interviews/:id
 * @access Private
 */
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if user is authorized to access this interview
    if (interview.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview',
      });
    }

    // Get questions for this interview
    const questions = await InterviewQuestion.find({
      interview: interview._id,
    }).sort({ orderIndex: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...interview.toObject(),
        questions,
      },
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve interview',
      error: error.message,
    });
  }
};

/**
 * Update an interview
 * @route PUT /api/interviews/:id
 * @access Private
 */
export const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if user is authorized to update this interview
    if (interview.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview',
      });
    }

    // Update interview fields
    const { title, description, jobPosition, status, timeLimit } = req.body;
    
    interview.title = title || interview.title;
    interview.description = description || interview.description;
    interview.jobPosition = jobPosition || interview.jobPosition;
    interview.status = status || interview.status;
    interview.timeLimit = timeLimit || interview.timeLimit;
    
    await interview.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: error.message,
    });
  }
};

/**
 * Delete an interview
 * @route DELETE /api/interviews/:id
 * @access Private
 */
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if user is authorized to delete this interview
    if (interview.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview',
      });
    }

    // Delete associated questions
    await InterviewQuestion.deleteMany({ interview: interview._id });
    
    // Delete the interview
    await interview.remove();

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message,
    });
  }
};

