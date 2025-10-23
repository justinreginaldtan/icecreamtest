const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// Set default environment variables for development
process.env.PORT = process.env.PORT || '3001'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/sweet-solutions'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '900000'
process.env.RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS || '100'

const connectDB = require('./config/database')
const { seedAllData } = require('./seeders')
const authRoutes = require('./routes/auth')
const employeeRoutes = require('./routes/employees')
const shiftRoutes = require('./routes/shifts')
const requestRoutes = require('./routes/requests')
const payrollRoutes = require('./routes/payroll')

const app = express()
const PORT = process.env.PORT || 3001

// Connect to database
connectDB()

// Seed all demo data after database connection
setTimeout(async () => {
  await seedAllData()
}, 2000) // Wait 2 seconds for DB connection

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/shifts', shiftRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/payroll', payrollRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`)
})

module.exports = app
