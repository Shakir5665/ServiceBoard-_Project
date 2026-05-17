const mongoose = require('mongoose');

const JobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery'],
    required: true,
  },
  location: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  ratedByHomeowner: {
    type: Boolean,
    default: false,
  },
  homeownerRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('JobRequest', JobRequestSchema);
