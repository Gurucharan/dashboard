const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: { // Changed from 'title' to 'eventName'
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  eventDate: { // Changed from 'startTime' to 'eventDate'
    type: Date,
    required: true,
  },
  eventTime: { // New field for time string
    type: String,
    default: '00:00',
  },
  eventLocation: { // Changed from 'location' to 'eventLocation'
    type: String,
    required: true,
  },
  eventStatus: { // New field
    type: String,
    enum: ['Scheduled', 'Postponed', 'Cancelled', 'Completed'],
    default: 'Scheduled',
  },
  eventCost: { // New field
    type: String,
    default: 'N/A',
  },
  eventImage: { // New field for image path
    type: String,
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', EventSchema);