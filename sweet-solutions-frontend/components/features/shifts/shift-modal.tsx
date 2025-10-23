"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api/client"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

interface ShiftModalProps {
  isOpen: boolean
  onClose: () => void
  shift?: any
}

export function ShiftModal({ isOpen, onClose, shift }: ShiftModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    role: "",
  })

  useEffect(() => {
    if (!user || !isOpen) return

    const fetchEmployees = async () => {
      try {
        const response = await apiClient.getEmployees()
        if (response.success) {
          setEmployees(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, [user, isOpen])

  useEffect(() => {
    if (shift) {
      setFormData({
        employeeId: shift.employee?.toString() || shift.employeeId?.toString() || "",
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        role: shift.role,
      })
    } else {
      setFormData({
        employeeId: "",
        date: "",
        startTime: "",
        endTime: "",
        role: "",
      })
    }
  }, [shift, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Transform form data to match API expectations
      const shiftData = {
        employee: formData.employeeId,
        employeeName: employees.find(emp => emp._id === formData.employeeId)?.name || "",
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        role: formData.role,
        status: "scheduled"
      }

      if (shift) {
        await apiClient.updateShift(shift._id, shiftData)
        toast({
          title: "Shift updated",
          description: "The shift has been updated successfully.",
          className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
        })
      } else {
        await apiClient.createShift(shiftData)
        toast({
          title: "Shift saved",
          description: "A new shift has been added to the schedule.",
          className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!shift) return
    
    setIsLoading(true)

    try {
      await apiClient.deleteShift(shift.id)
      toast({
        title: "Shift deleted",
        description: "The shift has been removed from the schedule.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shift.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.employeeId && formData.date && formData.startTime && formData.endTime && formData.role

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{shift ? "Edit Shift" : "Add New Shift"}</DialogTitle>
          <DialogDescription>
            {shift ? "Update the shift details below." : "Fill in the details to create a new shift."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Employee Select */}
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id.toString()}>
                      {emp.name} - {emp.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isLoading}
                className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                required
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g., Scooper, Barista"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isLoading}
                className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {shift && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                aria-busy={isLoading}
                data-testid="delete-shift-button"
                className="bg-[var(--brandPink)] text-white hover:bg-[color:rgba(240,78,152,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
              disabled={isLoading || !isFormValid}
              aria-busy={isLoading}
              data-testid="save-shift-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {shift ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{shift ? "Update" : "Create"} Shift</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
