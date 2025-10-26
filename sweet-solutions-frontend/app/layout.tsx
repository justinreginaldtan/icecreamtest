import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/auth-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Sweet Solutions - Scheduling & Payroll",
  description: "Internal scheduling and payroll management for Howdy Homemade",
  generator: "v0.app",
  icons: {
    icon: '/howdyslogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --bg: #FFF9F5;
            --surface: #FFFFFF;
            --text: #2C2A29;
            --border: #E5E0DB;
            --primary: #F46C5B;
            --brandBlue: #49B6C2;
            --brandPink: #F04E98;
            --muted: #F7EFEA;
          }
        `}</style>
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
