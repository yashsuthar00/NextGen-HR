import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job ID must be required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID must be required"],
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled",
        },

        questions: [
            {
                question: {
                    type: String,
                    // required: [true, "Question must be required"],
                },
                answerAudioUrl: {
                    type: String,
                    // required: [true, "Audio URL must be required"],
                },
                videoUrl: {
                    type: String, // Add this field for video URLs
                },
            },
        ],
        // dateTime: {
        //     type: Date,
        //     required: [true, "Date and time must be required"],
        // },
        // dateTime: "2023-10-15T14:30:00Z" the input format should be like this for the above dateTime field

    },
    { timestamps: true }
);
const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;