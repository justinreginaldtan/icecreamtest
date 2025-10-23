const mongoose = require('mongoose')

const timeOffRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedDate: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
timeOffRequestSchema.index({ employee: 1, status: 1 })
timeOffRequestSchema.index({ startDate: 1, endDate: 1 })

module.exports = mongoose.model('TimeOffRequest', timeOffRequestSchema)
