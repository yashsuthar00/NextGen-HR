import Job from '../models/jobModel.js';
import { env } from '../utils/validateEnv.js';

class JobController {

    static async createJob(req, res) {
        try {
            const { title, description, eligibility } = req.body;

            // Validate required fields
            if (!title || !description || !eligibility) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Create a new job
            const newJob = new Job({
                title,
                description,
                eligibility,
            });

            await newJob.save();
            res.status(201).json({ message: 'Job created successfully', job: newJob });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    static async getJobs(req, res) {
        try {
            const jobs = await Job.find();
            res.json(jobs);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await Job.findById(id);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }
            res.json(job);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const { title, description, eligibility } = req.body;

            // Validate required fields
            if (!title || !description || !eligibility) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Update the job by ID
            const updatedJob = await Job.findByIdAndUpdate(id, { title, description, eligibility }, { new: true });
            if (!updatedJob) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({ message: 'Job updated successfully', updatedJob });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    static async deleteJob(req, res) {
        try {
            const { id } = req.params;

            // Delete the job by ID
            const deletedJob = await Job.findByIdAndDelete(id);
            if (!deletedJob) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({ message: 'Job deleted successfully', deletedJob });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}

export default JobController;