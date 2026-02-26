"use client"

import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      value={{ light: "bumblebee", dark: "coffee" }}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
