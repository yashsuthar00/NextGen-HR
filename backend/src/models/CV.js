import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  gsutil_url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('CV', cvSchema);
