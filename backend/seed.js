const mongoose = require('mongoose');
const dotenv = require('dotenv');
const JobRequest = require('./models/JobRequest');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-request-board')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await JobRequest.deleteMany();
    console.log('Cleared existing job requests');

    const sampleJobs = [
      {
        title: 'Leaking kitchen tap in Glasgow',
        description: 'The cold water tap in the kitchen is dripping constantly. Need a plumber to replace the washer or the tap itself.',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Alice Smith',
        contactEmail: 'alice@example.com',
        status: 'Open'
      },
      {
        title: 'Rewire living room lights',
        description: 'Looking to install 4 new spotlights in the living room ceiling. Current wiring might need an update.',
        category: 'Electrical',
        location: 'Edinburgh',
        contactName: 'Bob Jones',
        contactEmail: 'bob@example.com',
        status: 'Open'
      },
      {
        title: 'Paint exterior of house',
        description: 'Semi-detached house needs the front exterior wall painted white. Scaffolding might be required.',
        category: 'Painting',
        location: 'Dundee',
        contactName: 'Charlie Brown',
        contactEmail: 'charlie@example.com',
        status: 'In Progress'
      },
      {
        title: 'Build custom wardrobe',
        description: 'Need a joiner to build a fitted wardrobe in the master bedroom. Dimensions are roughly 2m x 2.5m.',
        category: 'Joinery',
        location: 'Aberdeen',
        contactName: 'Diana Prince',
        contactEmail: 'diana@example.com',
        status: 'Open'
      },
      {
        title: 'Fix broken fuse box',
        description: 'The main fuse box trips randomly. Need an electrician to diagnose and fix the issue ASAP.',
        category: 'Electrical',
        location: 'Inverness',
        contactName: 'Eve Davis',
        contactEmail: 'eve@example.com',
        status: 'Closed'
      },
      {
        title: 'Unblock bathroom sink',
        description: 'Bathroom sink is completely blocked and draining very slowly. Tried standard unblockers with no success.',
        category: 'Plumbing',
        location: 'Stirling',
        contactName: 'Frank Miller',
        contactEmail: 'frank@example.com',
        status: 'Open'
      }
    ];

    await JobRequest.insertMany(sampleJobs);
    console.log('Successfully inserted 6 sample jobs');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
