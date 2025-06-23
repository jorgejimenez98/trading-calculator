import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { PropsWithChildren } from "react"
import { InstallPromptButton } from "@/components/install-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LWex Trading Calculator",
  description: "Calculate your trading returns with compound daily growth - LWex Commander Anthony",
  generator: 'v0.dev',
  manifest: '/manifest',
  themeColor: '#9333ea',
}

export default function RootLayout({ children}: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {children}

          <InstallPromptButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
