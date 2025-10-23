const Employee = require('../models/Employee')

const demoEmployees = [
  {
    name: 'Mari Lisa',
    role: 'Store Manager',
    hoursPerWeek: 40,
    hourlyRate: 18.00,
    email: 'mari.lisa@example.com',
    phone: '(555) 123-4567',
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '17:00' }
    ],
    isActive: true
  },
  {
    name: 'Vidhi Patel',
    role: 'Shift Lead',
    hoursPerWeek: 35,
    hourlyRate: 15.50,
    email: 'vidhi@howdy.com',
    phone: '(555) 234-5678',
    availability: [
      { day: 'monday', startTime: '10:00', endTime: '18:00' },
      { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'friday', startTime: '10:00', endTime: '18:00' },
      { day: 'saturday', startTime: '10:00', endTime: '18:00' }
    ],
    isActive: true
  },
  {
    name: 'Chatcha Mantapaneewat',
    role: 'Scooper',
    hoursPerWeek: 25,
    hourlyRate: 12.00,
    email: 'chatcha@howdy.com',
    phone: '(555) 345-6789',
    availability: [
      { day: 'friday', startTime: '14:00', endTime: '22:00' },
      { day: 'saturday', startTime: '14:00', endTime: '22:00' },
      { day: 'sunday', startTime: '14:00', endTime: '22:00' }
    ],
    isActive: true
  },
  {
    name: 'Alex Johnson',
    role: 'Scooper',
    hoursPerWeek: 20,
    hourlyRate: 12.00,
    email: 'alex.johnson@example.com',
    phone: '(555) 456-7890',
    availability: [
      { day: 'saturday', startTime: '12:00', endTime: '20:00' },
      { day: 'sunday', startTime: '12:00', endTime: '20:00' }
    ],
    isActive: true
  },
  {
    name: 'Sarah Chen',
    role: 'Cashier',
    hoursPerWeek: 30,
    hourlyRate: 13.50,
    email: 'sarah.chen@example.com',
    phone: '(555) 567-8901',
    availability: [
      { day: 'monday', startTime: '08:00', endTime: '16:00' },
      { day: 'tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'friday', startTime: '08:00', endTime: '16:00' }
    ],
    isActive: true
  },
  {
    name: 'Mike Rodriguez',
    role: 'Scooper',
    hoursPerWeek: 28,
    hourlyRate: 12.00,
    email: 'mike.rodriguez@example.com',
    phone: '(555) 678-9012',
    availability: [
      { day: 'tuesday', startTime: '11:00', endTime: '19:00' },
      { day: 'wednesday', startTime: '11:00', endTime: '19:00' },
      { day: 'thursday', startTime: '11:00', endTime: '19:00' },
      { day: 'friday', startTime: '11:00', endTime: '19:00' },
      { day: 'saturday', startTime: '11:00', endTime: '19:00' }
    ],
    isActive: true
  },
  {
    name: 'Emma Wilson',
    role: 'Cashier',
    hoursPerWeek: 22,
    hourlyRate: 13.50,
    email: 'emma.wilson@example.com',
    phone: '(555) 789-0123',
    availability: [
      { day: 'monday', startTime: '13:00', endTime: '21:00' },
      { day: 'wednesday', startTime: '13:00', endTime: '21:00' },
      { day: 'friday', startTime: '13:00', endTime: '21:00' },
      { day: 'saturday', startTime: '13:00', endTime: '21:00' }
    ],
    isActive: true
  }
]

const seedEmployees = async () => {
  try {
    console.log('🌱 Seeding employees...')
    
    // Clear existing employees
    await Employee.deleteMany({})
    
    // Create employees
    for (const employeeData of demoEmployees) {
      const employee = new Employee(employeeData)
      await employee.save()
      console.log(`✅ Created employee: ${employeeData.name} (${employeeData.role})`)
    }
    
    console.log('🎉 Employees seeded successfully!')
    return await Employee.find()
  } catch (error) {
    console.error('❌ Error seeding employees:', error)
    return []
  }
}

module.exports = { seedEmployees }
