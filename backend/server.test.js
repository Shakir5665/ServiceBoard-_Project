const request = require('supertest');
const app = require('./server');
const JobRequest = require('./models/JobRequest');

// Mock mongoose models to keep unit tests isolated and fast (no DB required)
jest.mock('./models/JobRequest');

describe('Job Board API Endpoints Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ping', () => {
    it('should respond with 200 OK and health details', async () => {
      const res = await request(app).get('/api/ping');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/jobs', () => {
    it('should return a list of all jobs with 200 OK', async () => {
      const mockJobs = [
        {
          _id: 'job123',
          title: 'Repair Kitchen Sink',
          category: 'Plumbing',
          status: 'Open',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'job456',
          title: 'Fix Living Room Light',
          category: 'Electrical',
          status: 'Open',
          createdAt: new Date().toISOString()
        }
      ];

      // Mock Mongoose chaining: JobRequest.find().populate().sort()
      JobRequest.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockJobs)
      });

      const res = await request(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe('Repair Kitchen Sink');
      expect(res.body[1].category).toBe('Electrical');
    });

    it('should handle search queries correctly', async () => {
      const mockJobs = [
        {
          _id: 'job123',
          title: 'Repair Kitchen Sink',
          category: 'Plumbing',
          status: 'Open'
        }
      ];

      JobRequest.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockJobs)
      });

      const res = await request(app).get('/api/jobs?search=sink');

      expect(res.status).toBe(200);
      expect(JobRequest.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: 'sink', $options: 'i' } },
          { description: { $regex: 'sink', $options: 'i' } }
        ]
      });
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return job details with 200 OK if the job exists', async () => {
      const mockJob = {
        _id: 'job123',
        title: 'Repair Kitchen Sink',
        category: 'Plumbing',
        status: 'Open',
        contactName: 'Raahil',
        assignedTo: {
          _id: 'user456',
          name: 'Shakir',
          email: 'shakir@example.com'
        }
      };

      // Mock JobRequest.findById().populate()
      JobRequest.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockJob)
      });

      const res = await request(app).get('/api/jobs/job123');

      expect(res.status).toBe(200);
      expect(res.body._id).toBe('job123');
      expect(res.body.title).toBe('Repair Kitchen Sink');
      expect(res.body.assignedTo.name).toBe('Shakir');
    });

    it('should return 404 Not Found if the job does not exist', async () => {
      // Mock JobRequest.findById().populate() to return null
      JobRequest.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const res = await request(app).get('/api/jobs/nonexistent123');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Job not found');
    });

    it('should return 500 error if findById fails', async () => {
      JobRequest.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database corruption'))
      });

      const res = await request(app).get('/api/jobs/error123');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error fetching job details');
      expect(res.body.error).toBe('Database corruption');
    });
  });
});
