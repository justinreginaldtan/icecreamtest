const TimeOffRequest = require('../models/TimeOffRequest')
const Employee = require('../models/Employee')

const seedTimeOffRequests = async () => {
  try {
    console.log('🌱 Seeding time-off requests...')
    
    // Clear existing requests
    await TimeOffRequest.deleteMany({})
    
    // Get employees to reference
    const employees = await Employee.find()
    if (employees.length === 0) {
      console.log('⚠️  No employees found, skipping time-off requests')
      return []
    }
    
    const demoRequests = [
      {
        employee: employees[2]._id, // Chatcha
        employeeName: employees[2].name,
        startDate: new Date('2025-01-25'),
        endDate: new Date('2025-01-27'),
        reason: 'Family vacation',
        status: 'pending',
        submittedDate: new Date('2025-01-15')
      },
      {
        employee: employees[1]._id, // Vidhi
        employeeName: employees[1].name,
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-12'),
        reason: 'Medical appointment',
        status: 'pending',
        submittedDate: new Date('2025-01-20')
      },
      {
        employee: employees[3]._id, // Alex
        employeeName: employees[3].name,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-16'),
        reason: 'Personal day',
        status: 'approved',
        submittedDate: new Date('2025-01-10')
      },
      {
        employee: employees[4]._id, // Sarah
        employeeName: employees[4].name,
        startDate: new Date('2025-01-30'),
        endDate: new Date('2025-02-02'),
        reason: 'Wedding',
        status: 'approved',
        submittedDate: new Date('2025-01-05')
      },
      {
        employee: employees[5]._id, // Mike
        employeeName: employees[5].name,
        startDate: new Date('2025-02-05'),
        endDate: new Date('2025-02-07'),
        reason: 'Conference',
        status: 'denied',
        submittedDate: new Date('2025-01-18')
      }
    ]
    
    // Create requests
    for (const requestData of demoRequests) {
      const request = new TimeOffRequest(requestData)
      await request.save()
      console.log(`✅ Created request: ${requestData.employeeName} - ${requestData.reason}`)
    }
    
    console.log('🎉 Time-off requests seeded successfully!')
    return await TimeOffRequest.find()
  } catch (error) {
    console.error('❌ Error seeding time-off requests:', error)
    return []
  }
}

module.exports = { seedTimeOffRequests }
