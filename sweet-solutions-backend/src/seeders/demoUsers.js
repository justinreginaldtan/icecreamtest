const User = require('../models/User')

const demoUsers = [
  {
    name: 'Mari Lisa',
    email: 'mari.lisa@example.com',
    password: 'demo123',
    role: 'manager',
    isActive: true
  },
  {
    name: 'Justin Tan',
    email: 'justin.tan@example.com',
    password: 'demo123',
    role: 'employee',
    isActive: true
  }
]

const seedDemoUsers = async () => {
  try {
    console.log('🌱 Seeding demo users...')
    
    // Clear existing demo users
    await User.deleteMany({ 
      email: { $in: demoUsers.map(user => user.email) } 
    })
    
    // Create demo users
    for (const userData of demoUsers) {
      const user = new User(userData)
      await user.save()
      console.log(`✅ Created user: ${userData.name} (${userData.email})`)
    }
    
    console.log('🎉 Demo users seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding demo users:', error)
  }
}

module.exports = { seedDemoUsers }
