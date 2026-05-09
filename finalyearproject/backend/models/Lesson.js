const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  week: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    default: 1
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'document']
    },
    url: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
