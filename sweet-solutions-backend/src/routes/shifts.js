const express = require('express')
const Shift = require('../models/Shift')
const Employee = require('../models/Employee')
const { auth, requireRole } = require('../middleware/auth')
const { validateShift } = require('../middleware/validation')

const router = express.Router()

// Get all shifts
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, employee } = req.query
    let query = {}

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    // Filter by employee
    if (employee) {
      query.employee = employee
    }

    const shifts = await Shift.find(query)
      .populate('employee', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ date: 1, startTime: 1 })

    res.json({
      success: true,
      data: shifts,
      count: shifts.length
    })
  } catch (error) {
    console.error('Get shifts error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shifts'
    })
  }
})

// Get shift by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate('employee', 'name email role')
      .populate('createdBy', 'name email')

    if (!shift) {
      return res.status(404).json({
        success: false,
        error: 'Shift not found'
      })
    }

    res.json({
      success: true,
      data: shift
    })
  } catch (error) {
    console.error('Get shift error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shift'
    })
  }
})

// Create new shift
router.post('/', auth, validateShift, async (req, res) => {
  try {
    const { employee: employeeId, ...shiftData } = req.body

    // Verify employee exists
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    // Check for overlapping shifts
    const overlappingShift = await Shift.findOne({
      employee: employeeId,
      date: shiftData.date,
      $or: [
        {
          startTime: { $lt: shiftData.endTime },
          endTime: { $gt: shiftData.startTime }
        }
      ]
    })

    if (overlappingShift) {
      return res.status(400).json({
        success: false,
        error: 'Shift overlaps with existing shift'
      })
    }

    const shift = new Shift({
      ...shiftData,
      employee: employeeId,
      employeeName: employee.name,
      createdBy: req.user._id
    })

    await shift.save()
    await shift.populate('employee', 'name email role')

    res.status(201).json({
      success: true,
      data: shift,
      message: 'Shift created successfully'
    })
  } catch (error) {
    console.error('Create shift error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create shift'
    })
  }
})

// Update shift
router.put('/:id', auth, validateShift, async (req, res) => {
  try {
    const { employee: employeeId, ...shiftData } = req.body

    // Verify employee exists
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    // Check for overlapping shifts (excluding current shift)
    const overlappingShift = await Shift.findOne({
      _id: { $ne: req.params.id },
      employee: employeeId,
      date: shiftData.date,
      $or: [
        {
          startTime: { $lt: shiftData.endTime },
          endTime: { $gt: shiftData.startTime }
        }
      ]
    })

    if (overlappingShift) {
      return res.status(400).json({
        success: false,
        error: 'Shift overlaps with existing shift'
      })
    }

    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      {
        ...shiftData,
        employee: employeeId,
        employeeName: employee.name
      },
      { new: true, runValidators: true }
    ).populate('employee', 'name email role')

    if (!shift) {
      return res.status(404).json({
        success: false,
        error: 'Shift not found'
      })
    }

    res.json({
      success: true,
      data: shift,
      message: 'Shift updated successfully'
    })
  } catch (error) {
    console.error('Update shift error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update shift'
    })
  }
})

// Delete shift
router.delete('/:id', auth, async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id)

    if (!shift) {
      return res.status(404).json({
        success: false,
        error: 'Shift not found'
      })
    }

    res.json({
      success: true,
      message: 'Shift deleted successfully'
    })
  } catch (error) {
    console.error('Delete shift error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete shift'
    })
  }
})

module.exports = router
