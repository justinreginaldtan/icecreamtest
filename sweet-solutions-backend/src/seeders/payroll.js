const Payroll = require('../models/Payroll')
const Employee = require('../models/Employee')

const seedPayroll = async () => {
  try {
    console.log('🌱 Seeding payroll...')
    
    // Clear existing payroll
    await Payroll.deleteMany({})
    
    // Get employees to reference
    const employees = await Employee.find()
    if (employees.length === 0) {
      console.log('⚠️  No employees found, skipping payroll')
      return []
    }
    
    const demoPayroll = employees.map(emp => ({
      employee: emp._id,
      employeeName: emp.name,
      role: emp.role,
      period: 'January 2025',
      payPeriod: '2025-01-01 to 2025-01-15',
      hoursWorked: emp.hoursPerWeek * 2, // 2 weeks
      hourlyRate: emp.hourlyRate,
      grossPay: emp.hoursPerWeek * 2 * emp.hourlyRate,
      totalPay: emp.hoursPerWeek * 2 * emp.hourlyRate,
      deductions: (emp.hoursPerWeek * 2 * emp.hourlyRate) * 0.15, // 15% deductions
      netPay: (emp.hoursPerWeek * 2 * emp.hourlyRate) * 0.85,
      status: 'paid',
      payDate: new Date('2025-01-16')
    }))
    
    // Create payroll records
    for (const payrollData of demoPayroll) {
      const payroll = new Payroll(payrollData)
      await payroll.save()
      console.log(`✅ Created payroll: ${payrollData.employeeName} - $${payrollData.netPay}`)
    }
    
    console.log('🎉 Payroll seeded successfully!')
    return await Payroll.find()
  } catch (error) {
    console.error('❌ Error seeding payroll:', error)
    return []
  }
}

module.exports = { seedPayroll }
