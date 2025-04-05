import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        // jobId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Job",
        //     required: [true, "Job ID must be required"],
        // },
        // userId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: [true, "User ID must be required"],
        // },
        // status: {
        //     type: String,
        //     enum: ["applied", "interview", "rejected", "accepted"],
        //     default: "applied",
        // },
        name: {
            type: String,
            required: [true, "Name must be required"],
        },
        email: {
            type: String,
            required: [true, "Email must be required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number must be required"],
        },
        resumeURL: {
            type: String,
            required: [true, "Resume must be required"],
        },
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
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;