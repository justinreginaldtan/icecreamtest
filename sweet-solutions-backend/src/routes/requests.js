const express = require('express')
const TimeOffRequest = require('../models/TimeOffRequest')
const Employee = require('../models/Employee')
const { auth, requireRole } = require('../middleware/auth')
const { validateTimeOffRequest } = require('../middleware/validation')

const router = express.Router()

// Get all time-off requests
router.get('/', auth, async (req, res) => {
  try {
    const { status, employee } = req.query
    let query = {}

    // Filter by status
    if (status) {
      query.status = status
    }

    // Filter by employee
    if (employee) {
      query.employee = employee
    }

    // If user is employee, only show their own requests
    if (req.user.role === 'employee') {
      const employeeRecord = await Employee.findOne({ email: req.user.email })
      if (employeeRecord) {
        query.employee = employeeRecord._id
      }
    }

    const requests = await TimeOffRequest.find(query)
      .populate('employee', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ submittedDate: -1 })

    res.json({
      success: true,
      data: requests,
      count: requests.length
    })
  } catch (error) {
    console.error('Get requests error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time-off requests'
    })
  }
})

// Get request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await TimeOffRequest.findById(req.params.id)
      .populate('employee', 'name email')
      .populate('reviewedBy', 'name email')

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Time-off request not found'
      })
    }

    // Check if employee can view this request
    if (req.user.role === 'employee') {
      const employeeRecord = await Employee.findOne({ email: req.user.email })
      if (!employeeRecord || request.employee.toString() !== employeeRecord._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        })
      }
    }

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('Get request error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time-off request'
    })
  }
})

// Create new time-off request
router.post('/', auth, validateTimeOffRequest, async (req, res) => {
  try {
    const { employee: employeeId, ...requestData } = req.body

    // If user is employee, use their employee record
    let finalEmployeeId = employeeId
    if (req.user.role === 'employee') {
      const employeeRecord = await Employee.findOne({ email: req.user.email })
      if (!employeeRecord) {
        return res.status(404).json({
          success: false,
          error: 'Employee record not found'
        })
      }
      finalEmployeeId = employeeRecord._id
    }

    // Verify employee exists
    const employee = await Employee.findById(finalEmployeeId)
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    // Check for overlapping requests
    const overlappingRequest = await TimeOffRequest.findOne({
      employee: finalEmployeeId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          startDate: { $lte: requestData.endDate },
          endDate: { $gte: requestData.startDate }
        }
      ]
    })

    if (overlappingRequest) {
      return res.status(400).json({
        success: false,
        error: 'Time-off request overlaps with existing request'
      })
    }

    const request = new TimeOffRequest({
      ...requestData,
      employee: finalEmployeeId,
      employeeName: employee.name
    })

    await request.save()
    await request.populate('employee', 'name email')

    res.status(201).json({
      success: true,
      data: request,
      message: 'Time-off request submitted successfully'
    })
  } catch (error) {
    console.error('Create request error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create time-off request'
    })
  }
})

// Approve request (Manager only)
router.put('/:id/approve', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { reviewNotes } = req.body

    const request = await TimeOffRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        reviewedBy: req.user._id,
        reviewedDate: new Date(),
        reviewNotes
      },
      { new: true }
    ).populate('employee', 'name email')

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Time-off request not found'
      })
    }

    res.json({
      success: true,
      data: request,
      message: 'Time-off request approved successfully'
    })
  } catch (error) {
    console.error('Approve request error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to approve time-off request'
    })
  }
})

// Deny request (Manager only)
router.put('/:id/deny', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { reviewNotes } = req.body

    const request = await TimeOffRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'denied',
        reviewedBy: req.user._id,
        reviewedDate: new Date(),
        reviewNotes
      },
      { new: true }
    ).populate('employee', 'name email')

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Time-off request not found'
      })
    }

    res.json({
      success: true,
      data: request,
      message: 'Time-off request denied'
    })
  } catch (error) {
    console.error('Deny request error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to deny time-off request'
    })
  }
})

module.exports = router
