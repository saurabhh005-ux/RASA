const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  relatedImages: {
    type: [{
      url: { type: String, required: true },
      caption: { type: String, default: '' }
    }],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
