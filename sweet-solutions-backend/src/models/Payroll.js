const mongoose = require('mongoose')

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true // e.g., "2025-01"
  },
  hoursWorked: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalPay: {
    type: Number,
    required: true,
    min: 0
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  overtimePay: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  netPay: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'approved', 'paid'],
    default: 'draft'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedDate: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for efficient queries
payrollSchema.index({ employee: 1, period: 1 })
payrollSchema.index({ period: 1, status: 1 })

module.exports = mongoose.model('Payroll', payrollSchema)
