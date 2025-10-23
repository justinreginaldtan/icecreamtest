import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

export const toastVariants = {
  success: {
    className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  error: {
    className: "bg-destructive text-white border-destructive",
    icon: <XCircle className="h-5 w-5" />,
  },
  warning: {
    className: "bg-[var(--primary)] text-white border-[var(--primary)]",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
    icon: <Info className="h-5 w-5" />,
  },
}

// Helper functions
export const showSuccessToast = (toast: any, title: string, description?: string) => {
  toast({
    title,
    description,
    ...toastVariants.success,
  })
}

export const showErrorToast = (toast: any, title: string, description?: string) => {
  toast({
    title,
    description,
    ...toastVariants.error,
  })
}

export const showWarningToast = (toast: any, title: string, description?: string) => {
  toast({
    title,
    description,
    ...toastVariants.warning,
  })
}

export const showInfoToast = (toast: any, title: string, description?: string) => {
  toast({
    title,
    description,
    ...toastVariants.info,
  })
}
