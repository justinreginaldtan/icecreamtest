const { seedDemoUsers } = require('./demoUsers')
const { seedEmployees } = require('./employees')
const { seedTimeOffRequests } = require('./timeOffRequests')
const { seedShifts } = require('./shifts')
const { seedPayroll } = require('./payroll')

const seedAllData = async () => {
  try {
    console.log('🚀 Starting comprehensive data seeding...')
    
    // Seed in order (users first, then data that references users)
    await seedDemoUsers()
    await seedEmployees()
    await seedTimeOffRequests()
    await seedShifts()
    await seedPayroll()
    
    console.log('🎉 All data seeded successfully!')
    console.log('📊 Database now contains:')
    console.log('   - 2 Users (manager + employee)')
    console.log('   - 7 Employees')
    console.log('   - 5 Time-off requests')
    console.log('   - 7 Shifts')
    console.log('   - 7 Payroll records')
    
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }
}

module.exports = { seedAllData }
