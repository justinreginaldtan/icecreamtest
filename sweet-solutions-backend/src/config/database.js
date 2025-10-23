const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL not set, using mock data mode')
      return
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL)

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log('⚠️  Database connection failed, running in mock data mode')
    console.log('   To connect to MongoDB, set DATABASE_URL in .env file')
    console.log('   For now, the API will work with mock data')
  }
}

module.exports = connectDB
