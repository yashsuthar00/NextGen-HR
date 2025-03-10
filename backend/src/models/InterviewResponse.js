import mongoose from 'mongoose';

const InterviewResponseSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    responses: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InterviewQuestion',
          required: true,
        },
        videoUrl: {
          type: String,
          required: false,
        },
        cloudinaryPublicId: {
          type: String,
          required: false,
        },
        duration: {
          type: Number, // Duration in seconds
          required: false,
        },
        transcription: {
          type: String,
          required: false,
        },
        aiAnalysis: {
          type: mongoose.Schema.Types.Mixed,
          required: false,
        },
        uploadStatus: {
          type: String,
          enum: ['pending', 'uploading', 'completed', 'failed'],
          default: 'pending',
        },
        uploadProgress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InterviewResponse', InterviewResponseSchema);
