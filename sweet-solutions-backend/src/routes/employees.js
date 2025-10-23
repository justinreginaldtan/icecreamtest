const express = require('express')
const Employee = require('../models/Employee')
const { auth, requireRole } = require('../middleware/auth')
const { validateEmployee } = require('../middleware/validation')
const { mockEmployees } = require('../middleware/mockData')

const router = express.Router()

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    // Check if database is connected
    if (Employee.db.readyState !== 1) {
      // Use mock data if database not connected
      return res.json({
        success: true,
        data: mockEmployees,
        count: mockEmployees.length
      })
    }

    const employees = await Employee.find({ isActive: true })
      .sort({ name: 1 })

    res.json({
      success: true,
      data: employees,
      count: employees.length
    })
  } catch (error) {
    console.error('Get employees error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    })
  }
})

// Get employee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    res.json({
      success: true,
      data: employee
    })
  } catch (error) {
    console.error('Get employee error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    })
  }
})

// Create new employee (Manager only)
router.post('/', auth, requireRole(['manager']), validateEmployee, async (req, res) => {
  try {
    const employee = new Employee(req.body)
    await employee.save()

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    })
  } catch (error) {
    console.error('Create employee error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Employee with this email already exists'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    })
  }
})

// Update employee (Manager only)
router.put('/:id', auth, requireRole(['manager']), validateEmployee, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    res.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    })
  } catch (error) {
    console.error('Update employee error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    })
  }
})

// Delete employee (Manager only)
router.delete('/:id', auth, requireRole(['manager']), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      })
    }

    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    })
  } catch (error) {
    console.error('Delete employee error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    })
  }
})

module.exports = router
