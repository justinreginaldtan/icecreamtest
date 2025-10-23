const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T = any> {
  success: boolean
  data?: T & { token?: string; user?: any }
  error?: string
  message?: string
  count?: number
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  }

  private getMockData(endpoint: string, method: string): ApiResponse {
    // Mock login data
    if (endpoint === '/api/auth/login' && method === 'POST') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'mari.lisa@example.com',
            name: 'Mari Lisa',
            role: 'manager'
          }
        }
      }
    }

    // Mock employees data
    if (endpoint === '/api/employees' && method === 'GET') {
      return {
        success: true,
        data: [
          { id: '1', name: 'Mari Lisa', role: 'Store Manager', email: 'mari.lisa@example.com', phone: '(555) 123-4567', hours: 40 },
          { id: '2', name: 'Vidhi Patel', role: 'Shift Lead', email: 'vidhi@howdy.com', phone: '(555) 234-5678', hours: 35 },
          { id: '3', name: 'Chatcha Mantapaneewat', role: 'Scooper', email: 'chatcha@howdy.com', phone: '(555) 345-6789', hours: 25 }
        ],
        count: 3
      }
    }

    // Default mock response
    return {
      success: true,
      data: [],
      message: 'Mock data - backend not available'
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      
      // If it's a network error and we're in development, return mock data
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend not available, using mock data for development')
        return this.getMockData(endpoint, options.method || 'GET')
      }
      
      throw error
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success && response.data?.token) {
      this.token = response.data.token
      localStorage.setItem('auth-token', response.data.token)
    }
    
    return response
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    })
    
    this.token = null
    localStorage.removeItem('auth-token')
    
    return response
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  // Employee methods
  async getEmployees() {
    return this.request('/api/employees')
  }

  async getEmployee(id: string) {
    return this.request(`/api/employees/${id}`)
  }

  async createEmployee(data: any) {
    return this.request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: string) {
    return this.request(`/api/employees/${id}`, {
      method: 'DELETE',
    })
  }

  // Shift methods
  async getShifts(params?: { startDate?: string; endDate?: string; employee?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.employee) queryParams.append('employee', params.employee)
    
    const endpoint = `/api/shifts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async getShift(id: string) {
    return this.request(`/api/shifts/${id}`)
  }

  async createShift(data: any) {
    return this.request('/api/shifts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateShift(id: string, data: any) {
    return this.request(`/api/shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteShift(id: string) {
    return this.request(`/api/shifts/${id}`, {
      method: 'DELETE',
    })
  }

  // Time-off request methods
  async getRequests(params?: { status?: string; employee?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.employee) queryParams.append('employee', params.employee)
    
    const endpoint = `/api/requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  // Alias for getRequests to match frontend usage
  async getTimeOffRequests(params?: { status?: string; employee?: string }) {
    return this.getRequests(params)
  }

  async getRequest(id: string) {
    return this.request(`/api/requests/${id}`)
  }

  async createRequest(data: any) {
    return this.request('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async approveRequest(id: string, reviewNotes?: string) {
    return this.request(`/api/requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ reviewNotes }),
    })
  }

  async denyRequest(id: string, reviewNotes?: string) {
    return this.request(`/api/requests/${id}/deny`, {
      method: 'PUT',
      body: JSON.stringify({ reviewNotes }),
    })
  }

  // Payroll methods
  async getPayroll(params?: { period?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.period) queryParams.append('period', params.period)
    
    const endpoint = `/api/payroll${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async generatePayroll(period: string) {
    return this.request('/api/payroll/generate', {
      method: 'POST',
      body: JSON.stringify({ period }),
    })
  }

  async exportPayroll(period?: string) {
    const queryParams = new URLSearchParams()
    if (period) queryParams.append('period', period)
    
    const endpoint = `/api/payroll/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to export payroll')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payroll-${period || 'all'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  async updatePayrollStatus(id: string, status: string) {
    return this.request(`/api/payroll/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
