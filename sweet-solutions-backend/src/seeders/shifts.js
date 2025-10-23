const Shift = require('../models/Shift')
const Employee = require('../models/Employee')

const seedShifts = async () => {
  try {
    console.log('🌱 Seeding shifts...')
    
    // Clear existing shifts
    await Shift.deleteMany({})
    
    // Get employees to reference
    const employees = await Employee.find()
    if (employees.length === 0) {
      console.log('⚠️  No employees found, skipping shifts')
      return []
    }
    
    const demoShifts = [
      {
        employee: employees[0]._id, // Mari Lisa
        employeeName: employees[0].name,
        date: '2025-01-20',
        startTime: '09:00',
        endTime: '17:00',
        role: 'Store Manager',
        status: 'scheduled'
      },
      {
        employee: employees[1]._id, // Vidhi
        employeeName: employees[1].name,
        date: '2025-01-20',
        startTime: '10:00',
        endTime: '18:00',
        role: 'Shift Lead',
        status: 'scheduled'
      },
      {
        employee: employees[2]._id, // Chatcha
        employeeName: employees[2].name,
        date: '2025-01-20',
        startTime: '14:00',
        endTime: '22:00',
        role: 'Scooper',
        status: 'scheduled'
      },
      {
        employee: employees[3]._id, // Alex
        employeeName: employees[3].name,
        date: new Date('2025-01-21'),
        startTime: '12:00',
        endTime: '20:00',
        role: 'Scooper',
        status: 'scheduled'
      },
      {
        employee: employees[4]._id, // Sarah
        employeeName: employees[4].name,
        date: new Date('2025-01-21'),
        startTime: '08:00',
        endTime: '16:00',
        role: 'Cashier',
        status: 'scheduled'
      },
      {
        employee: employees[5]._id, // Mike
        employeeName: employees[5].name,
        date: new Date('2025-01-22'),
        startTime: '11:00',
        endTime: '19:00',
        role: 'Scooper',
        status: 'scheduled'
      },
      {
        employee: employees[6]._id, // Emma
        employeeName: employees[6].name,
        date: new Date('2025-01-22'),
        startTime: '13:00',
        endTime: '21:00',
        role: 'Cashier',
        status: 'scheduled'
      }
    ]
    
    // Create shifts
    for (const shiftData of demoShifts) {
      const shift = new Shift(shiftData)
      await shift.save()
      console.log(`✅ Created shift: ${shiftData.employeeName} - ${shiftData.date.toDateString()}`)
    }
    
    console.log('🎉 Shifts seeded successfully!')
    return await Shift.find()
  } catch (error) {
    console.error('❌ Error seeding shifts:', error)
    return []
  }
}

module.exports = { seedShifts }
