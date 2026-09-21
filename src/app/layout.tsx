import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'De Reality Spec — Referral workspace',
  description: 'De Reality Spec — meaningful connections, rewarding referrals. Register your interest and manage your real estate referral network.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <meta name="theme-color" content="#0E4FAB" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
