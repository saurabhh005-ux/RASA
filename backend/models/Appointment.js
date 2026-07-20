const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
    enum: ['Interior Designing', 'Painting', 'Renovation', 'Other']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
