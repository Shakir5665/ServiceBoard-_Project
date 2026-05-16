const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JobRequest = require('./models/JobRequest');
const User = require('./models/User');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — open to all origins; auth is enforced by JWT on every protected route
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-request-board')
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/**
 * UTILITY FUNCTIONS
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  experience: user.experience,
  hourlyRate: user.hourlyRate,
  serviceArea: user.serviceArea,
  bio: user.bio,
  completedJobs: user.completedJobs,
  rating: user.rating,
  ratingCount: user.ratingCount,
});

/**
 * AUTHENTICATION ROUTES
 */

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, experience, hourlyRate, serviceArea, bio } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, experience, hourlyRate, serviceArea, bio });
    
    res.status(201).json({ 
      token: generateToken(user._id), 
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({ 
        token: generateToken(user._id), 
        user: formatUserResponse(user) 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get own profile (fresh from DB)
app.get('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
app.patch('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = ['name', 'experience', 'hourlyRate', 'serviceArea', 'bio'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    const updatedUser = await user.save();
    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
});

/**
 * JOB MANAGEMENT ROUTES
 */

// List all jobs with filters
app.get('/api/jobs', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await JobRequest.find(filter)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Fetch jobs created by the logged-in homeowner
app.get('/api/jobs/my-jobs', protect, async (req, res) => {
  try {
    if (req.user.role !== 'homeowner') {
      return res.status(403).json({ message: 'Access restricted to homeowners' });
    }
    
    const jobs = await JobRequest.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
    
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ jobId: job._id, status: 'pending' });
      return { ...job, applicantCount };
    }));
    
    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your jobs', error: error.message });
  }
});

// Fetch jobs assigned to the logged-in tradesperson
app.get('/api/jobs/assigned-to-me', protect, async (req, res) => {
  try {
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ message: 'Access restricted to tradespeople' });
    }
    const jobs = await JobRequest.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// Fetch single job details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job details', error: error.message });
  }
});

// Create new job
app.post('/api/jobs', protect, async (req, res) => {
  try {
    if (req.user.role !== 'homeowner') {
      return res.status(403).json({ message: 'Only homeowners can post jobs' });
    }
    const newJob = new JobRequest({ ...req.body, createdBy: req.user._id });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error posting job', error: error.message });
  }
});

// Update job status (Tradesperson)
app.patch('/api/jobs/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ message: 'Only tradespeople can update project status' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.assignedTo || job.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not assigned to this job' });
    }

    if (req.body.status) {
      const oldStatus = job.status;
      job.status = req.body.status;
      
      // Handle project completion
      if (req.body.status === 'Closed' && oldStatus !== 'Closed') {
        await User.findByIdAndUpdate(req.user._id, { $inc: { completedJobs: 1 } });
        
        await Notification.create({
          userId: job.createdBy,
          message: `Your job "${job.title}" has been marked as completed by ${req.user.name}.`,
          type: 'approval'
        });
      }
    }
    if (req.body.assignedTo) job.assignedTo = req.body.assignedTo;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating status', error: error.message });
  }
});

// Delete job (Homeowner)
app.delete('/api/jobs/:id', protect, async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the creator can delete this job' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ message: 'Cannot delete jobs that are active or completed' });
    }

    await JobRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
});

/**
 * APPLICATION ROUTES
 */

// Submit application for a job
app.post('/api/jobs/:id/apply', protect, async (req, res) => {
  try {
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ message: 'Only tradespeople can apply' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    if (job.status !== 'Open' || job.assignedTo) {
      return res.status(400).json({ message: 'Applications are no longer accepted for this job' });
    }

    const existingApplication = await Application.findOne({
      jobId: req.params.id,
      tradespersonId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'Application already submitted' });
    }

    const application = await Application.create({
      jobId: req.params.id,
      tradespersonId: req.user._id,
      message: req.body.message
    });

    await Notification.create({
      userId: job.createdBy,
      message: `New application from ${req.user.name} for "${job.title}".`,
      type: 'info'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// View all applicants for a job
app.get('/api/jobs/:id/applicants', protect, async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const applications = await Application.find({ jobId: req.params.id })
      .populate('tradespersonId', 'name email experience hourlyRate serviceArea rating completedJobs bio');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
});

// Approve an application
app.patch('/api/applications/:id/approve', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = application.jobId;
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ message: 'Job is no longer open for approval' });
    }

    application.status = 'approved';
    await application.save();

    job.assignedTo = application.tradespersonId;
    job.status = 'In Progress';
    await job.save();

    // Reject other applications
    await Application.updateMany(
      { jobId: job._id, _id: { $ne: application._id } },
      { $set: { status: 'rejected' } }
    );

    // Notifications
    await Notification.create({
      userId: application.tradespersonId,
      message: `Your application for "${job.title}" has been approved!`,
      type: 'approval'
    });

    const otherApps = await Application.find({ jobId: job._id, _id: { $ne: application._id } });
    const bulkNotifications = otherApps.map(app => ({
      userId: app.tradespersonId,
      message: `Your application for "${job.title}" was not selected.`,
      type: 'rejection'
    }));
    
    if (bulkNotifications.length > 0) {
      await Notification.insertMany(bulkNotifications);
    }

    res.json({ message: 'Application approved', application, job });
  } catch (error) {
    res.status(500).json({ message: 'Error processing approval', error: error.message });
  }
});

// Reject an application
app.patch('/api/applications/:id/reject', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.jobId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = 'rejected';
    await application.save();

    await Notification.create({
      userId: application.tradespersonId,
      message: `Your application for "${application.jobId.title}" was not selected.`,
      type: 'rejection'
    });

    res.json({ message: 'Application rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting application', error: error.message });
  }
});

/**
 * NOTIFICATION ROUTES
 */

// Fetch user notifications
app.get('/api/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});

// Clear all notifications
app.delete('/api/notifications', protect, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing notifications', error: error.message });
  }
});

/**
 * TRADESPERSON SPECIFIC ROUTES
 */

// Fetch tradesperson's application history
app.get('/api/tradesperson/my-applications', protect, async (req, res) => {
  try {
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ message: 'Access restricted' });
    }
    const applications = await Application.find({ tradespersonId: req.user._id })
      .populate('jobId', 'title description category status location contactName')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});


/**
 * RATING ROUTE
 */

// Submit a star rating for a completed job's tradesperson (homeowner only, once per job)
app.post('/api/jobs/:id/rate', protect, async (req, res) => {
  try {
    if (req.user.role !== 'homeowner') {
      return res.status(403).json({ message: 'Only homeowners can submit ratings' });
    }

    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You did not create this job' });
    }

    if (job.status !== 'Closed') {
      return res.status(400).json({ message: 'You can only rate a completed job' });
    }

    if (!job.assignedTo) {
      return res.status(400).json({ message: 'No tradesperson assigned to this job' });
    }

    if (job.ratedByHomeowner) {
      return res.status(400).json({ message: 'You have already rated this job' });
    }

    // Compute new running average rating
    const tradesperson = await User.findById(job.assignedTo);
    if (!tradesperson) return res.status(404).json({ message: 'Tradesperson not found' });

    const newCount = tradesperson.ratingCount + 1;
    const newRating = ((tradesperson.rating * tradesperson.ratingCount) + Number(rating)) / newCount;

    await User.findByIdAndUpdate(job.assignedTo, {
      rating: Math.round(newRating * 10) / 10,
      ratingCount: newCount,
    });

    job.ratedByHomeowner = true;
    await job.save();

    await Notification.create({
      userId: job.assignedTo,
      message: `You received a ${rating}-star rating for the job "${job.title}".`,
      type: 'approval',
    });

    res.json({ message: 'Rating submitted successfully', newRating: Math.round(newRating * 10) / 10 });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
