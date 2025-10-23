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
import { employees } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { saveShift, updateShift } from "@/lib/mock-api"
import { Loader2 } from "lucide-react"

interface ShiftModalProps {
  isOpen: boolean
  onClose: () => void
  shift?: any
}

export function ShiftModal({ isOpen, onClose, shift }: ShiftModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    role: "",
  })

  useEffect(() => {
    if (shift) {
      setFormData({
        employeeId: shift.employeeId.toString(),
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
      if (shift) {
        await updateShift(shift.id, formData)
      } else {
        await saveShift(formData)
      }

      toast({
        title: shift ? "Shift updated" : "Shift created",
        description: shift ? "The shift has been updated successfully." : "A new shift has been added to the schedule.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })

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
    setIsLoading(true)

    try {
      // Mock delete operation
      await new Promise((resolve) => setTimeout(resolve, 600))

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
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !isFormValid}
              aria-busy={isLoading}
              data-testid="save-shift-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {shift ? "Updating..." : "Creating..."}
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
