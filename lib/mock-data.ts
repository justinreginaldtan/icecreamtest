// Mock data for Sweet Solutions

export interface Employee {
  id: number
  name: string
  role: string
  hours: number
  email?: string
  phone?: string
  availability?: string[]
}

export interface Shift {
  id: number
  employeeId: number
  employeeName: string
  date: string
  startTime: string
  endTime: string
  role: string
}

export interface TimeOffRequest {
  id: number
  employeeId: number
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "denied"
  submittedDate: string
}

export interface PayrollEntry {
  id: number
  employeeId: number
  employeeName: string
  role: string
  hoursWorked: number
  hourlyRate: number
  totalPay: number
  period: string
}

// TODO: Replace with live data from AWS API Gateway
export const employees: Employee[] = [
  {
    id: 1,
    name: "Mari Lisa",
    role: "Store Manager",
    hours: 40,
    email: "mari.lisa@example.com",
    phone: "(555) 123-4567",
  },
  { id: 2, name: "Vidhi Patel", role: "Shift Lead", hours: 35, email: "vidhi@howdy.com", phone: "(555) 234-5678" },
  {
    id: 3,
    name: "Chatcha Mantapaneewat",
    role: "Scooper",
    hours: 25,
    email: "chatcha@howdy.com",
    phone: "(555) 345-6789",
  },
  { id: 4, name: "Natalie Tran", role: "Barista", hours: 28, email: "natalie@howdy.com", phone: "(555) 456-7890" },
  { id: 5, name: "Rayan Rashid", role: "Cashier", hours: 30, email: "rayan@howdy.com", phone: "(555) 567-8901" },
  {
    id: 6,
    name: "Justin Tan",
    role: "Scheduler / Developer",
    hours: 10,
    email: "justin.tan@example.com",
    phone: "(555) 678-9012",
  },
  {
    id: 7,
    name: "James Harris",
    role: "Scooper",
    hours: 20,
    email: "james@howdy.com",
    phone: "(555) 789-0123",
  },
]

export const shifts: Shift[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Mari Lisa",
    date: "2025-01-20",
    startTime: "09:00",
    endTime: "17:00",
    role: "Store Manager",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Vidhi Patel",
    date: "2025-01-20",
    startTime: "10:00",
    endTime: "18:00",
    role: "Shift Lead",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Chatcha Mantapaneewat",
    date: "2025-01-20",
    startTime: "12:00",
    endTime: "17:00",
    role: "Scooper",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "Natalie Tran",
    date: "2025-01-21",
    startTime: "11:00",
    endTime: "19:00",
    role: "Barista",
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: "Rayan Rashid",
    date: "2025-01-21",
    startTime: "13:00",
    endTime: "21:00",
    role: "Cashier",
  },
]

export const timeOffRequests: TimeOffRequest[] = [
  {
    id: 1,
    employeeId: 3,
    employeeName: "Chatcha Mantapaneewat",
    startDate: "2025-01-25",
    endDate: "2025-01-27",
    reason: "Family vacation",
    status: "pending",
    submittedDate: "2025-01-15",
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: "Natalie Tran",
    startDate: "2025-02-01",
    endDate: "2025-02-01",
    reason: "Doctor's appointment",
    status: "pending",
    submittedDate: "2025-01-16",
  },
  {
    id: 3,
    employeeId: 5,
    employeeName: "Rayan Rashid",
    startDate: "2025-01-18",
    endDate: "2025-01-19",
    reason: "Personal day",
    status: "approved",
    submittedDate: "2025-01-10",
  },
]

export const payrollData: PayrollEntry[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Mari Lisa",
    role: "Store Manager",
    hoursWorked: 160,
    hourlyRate: 25,
    totalPay: 4000,
    period: "January 2025",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Vidhi Patel",
    role: "Shift Lead",
    hoursWorked: 140,
    hourlyRate: 18,
    totalPay: 2520,
    period: "January 2025",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Chatcha Mantapaneewat",
    role: "Scooper",
    hoursWorked: 100,
    hourlyRate: 15,
    totalPay: 1500,
    period: "January 2025",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "Natalie Tran",
    role: "Barista",
    hoursWorked: 112,
    hourlyRate: 16,
    totalPay: 1792,
    period: "January 2025",
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: "Rayan Rashid",
    role: "Cashier",
    hoursWorked: 120,
    hourlyRate: 15,
    totalPay: 1800,
    period: "January 2025",
  },
  {
    id: 6,
    employeeId: 6,
    employeeName: "Justin Tan",
    role: "Scheduler / Developer",
    hoursWorked: 40,
    hourlyRate: 30,
    totalPay: 1200,
    period: "January 2025",
  },
  {
    id: 7,
    employeeId: 7,
    employeeName: "James Harris",
    role: "Scooper",
    hoursWorked: 80,
    hourlyRate: 15,
    totalPay: 1200,
    period: "January 2025",
  },
]
