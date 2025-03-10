import mongoose from 'mongoose';

const InterviewQuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    orderIndex: {
      type: Number,
      required: true,
    },
    timeLimit: {
      type: Number, // Time limit in seconds (overrides interview default if set)
      required: false,
    },
    category: {
      type: String,
      enum: ['technical', 'behavioral', 'experience', 'culture', 'general'],
      default: 'general',
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InterviewQuestion', InterviewQuestionSchema);
