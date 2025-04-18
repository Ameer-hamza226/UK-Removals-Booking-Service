import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BookingProvider } from './context/BookingContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UK Removals Booking Service',
  description: 'Book your house or office removal service in 6 simple steps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  )
}
