// Mock data for development when database is not available
const mockEmployees = [
  {
    _id: '1',
    name: 'Mari Lisa',
    email: 'mari.lisa@example.com',
    phone: '(555) 123-4567',
    role: 'Store Manager',
    hourlyRate: 25,
    hoursPerWeek: 40,
    isActive: true
  },
  {
    _id: '2',
    name: 'Vidhi Patel',
    email: 'vidhi@howdy.com',
    phone: '(555) 234-5678',
    role: 'Shift Lead',
    hourlyRate: 18,
    hoursPerWeek: 35,
    isActive: true
  },
  {
    _id: '3',
    name: 'Chatcha Mantapaneewat',
    email: 'chatcha@howdy.com',
    phone: '(555) 345-6789',
    role: 'Scooper',
    hourlyRate: 15,
    hoursPerWeek: 25,
    isActive: true
  }
]

const mockShifts = [
  {
    _id: '1',
    employee: '1',
    employeeName: 'Mari Lisa',
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '17:00',
    role: 'Store Manager',
    status: 'scheduled'
  },
  {
    _id: '2',
    employee: '2',
    employeeName: 'Vidhi Patel',
    date: '2025-01-20',
    startTime: '10:00',
    endTime: '18:00',
    role: 'Shift Lead',
    status: 'scheduled'
  }
]

const mockRequests = [
  {
    _id: '1',
    employee: '3',
    employeeName: 'Chatcha Mantapaneewat',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    reason: 'Family vacation',
    status: 'pending',
    submittedDate: '2025-01-15'
  }
]

const mockPayroll = [
  {
    _id: '1',
    employee: '1',
    employeeName: 'Mari Lisa',
    role: 'Store Manager',
    period: '2025-01',
    hoursWorked: 160,
    hourlyRate: 25,
    totalPay: 4000,
    status: 'draft'
  }
]

module.exports = {
  mockEmployees,
  mockShifts,
  mockRequests,
  mockPayroll
}
