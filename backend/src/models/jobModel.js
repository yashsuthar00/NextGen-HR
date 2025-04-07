import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: [true, 'Title must be required'],
        },
        description: {
        type: String,
        required: [true, 'Description must be required'],
        },
        eligibility: {
        type: String,
        required: [true, 'Eligibility must be required'],
        },
        // location: {
        // type: String,
        // required: [true, 'Location must be required'],
        // },
        // type: {
        // type: String,
        // required: [true, 'Type must be required'],
        // },
        // category: {
        // type: String,
        // required: [true, 'Category must be required'],
        // },
        // company: {
        // type: String,
        // required: [true, 'Company must be required'],
        // },
        // website: {
        // type: String,
        // },
        // email: {
        // type: String,
        // required: [true, 'Email must be required'],
        // },
        // deadline: {
        // type: Date,
        // required: [true, 'Deadline must be required'],
        // },
        // jobImage: {
        // type: String,
        // required: [true, 'Job image must be required'],
        // },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;