const { body, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

// Auth validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
]

// Employee validation
const validateEmployee = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),
  body('hourlyRate')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),
  handleValidationErrors
]

// Shift validation
const validateShift = [
  body('employee')
    .isMongoId()
    .withMessage('Valid employee ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),
  handleValidationErrors
]

// Time-off request validation
const validateTimeOffRequest = [
  body('employee')
    .isMongoId()
    .withMessage('Valid employee ID is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('reason')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Reason must be at least 10 characters long'),
  handleValidationErrors
]

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateEmployee,
  validateShift,
  validateTimeOffRequest
}
