import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-game",
})

export const metadata: Metadata = {
  title: "Chhon Putheyka - Backend Engineer",
  description: "Junior Backend Developer | Laravel | API Development | TDD",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
