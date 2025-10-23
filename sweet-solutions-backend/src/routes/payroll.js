const express = require('express')
const Payroll = require('../models/Payroll')
const Employee = require('../models/Employee')
const Shift = require('../models/Shift')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get payroll data (Manager only)
router.get('/', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { period } = req.query
    let query = {}

    if (period) {
      query.period = period
    }

    const payrollData = await Payroll.find(query)
      .populate('employee', 'name email role')
      .populate('processedBy', 'name email')
      .sort({ period: -1, employeeName: 1 })

    res.json({
      success: true,
      data: payrollData,
      count: payrollData.length
    })
  } catch (error) {
    console.error('Get payroll error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payroll data'
    })
  }
})

// Generate payroll for period (Manager only)
router.post('/generate', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { period } = req.body // e.g., "2025-01"

    if (!period) {
      return res.status(400).json({
        success: false,
        error: 'Period is required (format: YYYY-MM)'
      })
    }

    // Check if payroll already exists for this period
    const existingPayroll = await Payroll.findOne({ period })
    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        error: 'Payroll already exists for this period'
      })
    }

    // Get all active employees
    const employees = await Employee.find({ isActive: true })

    // Calculate payroll for each employee
    const payrollEntries = []
    const startDate = new Date(period + '-01')
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

    for (const employee of employees) {
      // Get shifts for this employee in this period
      const shifts = await Shift.find({
        employee: employee._id,
        date: {
          $gte: startDate,
          $lte: endDate
        },
        status: 'completed'
      })

      // Calculate total hours
      let totalHours = 0
      for (const shift of shifts) {
        const start = new Date(`2000-01-01T${shift.startTime}:00`)
        const end = new Date(`2000-01-01T${shift.endTime}:00`)
        const hours = (end - start) / (1000 * 60 * 60)
        totalHours += hours
      }

      // Calculate overtime (over 40 hours per week)
      const weeksInPeriod = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000))
      const regularHours = Math.min(totalHours, weeksInPeriod * 40)
      const overtimeHours = Math.max(0, totalHours - (weeksInPeriod * 40))

      // Calculate pay
      const regularPay = regularHours * employee.hourlyRate
      const overtimePay = overtimeHours * employee.hourlyRate * 1.5
      const totalPay = regularPay + overtimePay

      const payrollEntry = new Payroll({
        employee: employee._id,
        employeeName: employee.name,
        role: employee.role,
        period,
        hoursWorked: totalHours,
        hourlyRate: employee.hourlyRate,
        totalPay,
        overtimeHours,
        overtimePay,
        netPay: totalPay,
        processedBy: req.user._id,
        processedDate: new Date(),
        status: 'draft'
      })

      await payrollEntry.save()
      payrollEntries.push(payrollEntry)
    }

    res.status(201).json({
      success: true,
      data: payrollEntries,
      message: `Payroll generated for ${period}`
    })
  } catch (error) {
    console.error('Generate payroll error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate payroll'
    })
  }
})

// Export payroll as CSV (Manager only)
router.get('/export', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { period } = req.query

    let query = {}
    if (period) {
      query.period = period
    }

    const payrollData = await Payroll.find(query)
      .populate('employee', 'name email')
      .sort({ period: -1, employeeName: 1 })

    if (payrollData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No payroll data found for export'
      })
    }

    // Convert to CSV
    const csvHeader = 'Employee Name,Role,Period,Hours Worked,Hourly Rate,Total Pay,Overtime Hours,Overtime Pay,Net Pay,Status'
    const csvRows = payrollData.map(entry => [
      entry.employeeName,
      entry.role,
      entry.period,
      entry.hoursWorked,
      entry.hourlyRate,
      entry.totalPay,
      entry.overtimeHours,
      entry.overtimePay,
      entry.netPay,
      entry.status
    ].join(','))

    const csv = [csvHeader, ...csvRows].join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=payroll-${period || 'all'}.csv`)
    res.send(csv)
  } catch (error) {
    console.error('Export payroll error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to export payroll data'
    })
  }
})

// Update payroll status (Manager only)
router.put('/:id/status', auth, requireRole(['manager']), async (req, res) => {
  try {
    const { status } = req.body

    if (!['draft', 'approved', 'paid'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be draft, approved, or paid'
      })
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('employee', 'name email')

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll entry not found'
      })
    }

    res.json({
      success: true,
      data: payroll,
      message: 'Payroll status updated successfully'
    })
  } catch (error) {
    console.error('Update payroll status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update payroll status'
    })
  }
})

module.exports = router
