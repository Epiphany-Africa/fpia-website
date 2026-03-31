import Image from 'next/image'
import type { Metadata } from 'next'
import './globals.css'
import Nav from './components/Nav'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'FPIA — Fair Property Inspection Authorities',
  description: 'Independent property certification. Accountability built in.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}