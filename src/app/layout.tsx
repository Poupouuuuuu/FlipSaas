import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: {
    default: 'Stockeesy | Gestion de stock pour revendeurs',
    template: '%s | Stockeesy',
  },
  description: 'Le tableau de bord pensé pour les revendeurs Vinted, Leboncoin et compagnie. Stock, marges, colis — tout est sous contrôle.',
  keywords: ['revendeur', 'vinted', 'leboncoin', 'gestion de stock', 'second hand', 'reseller', 'stockeesy'],
  authors: [{ name: 'Stockeesy' }],
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Stockeesy',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'Stockeesy | Gestion de stock pour revendeurs',
    description: 'Fini Excel. Gère ton stock de revendeur en 30 secondes.',
    url: 'https://flip-saas-one.vercel.app',
    siteName: 'Stockeesy',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stockeesy | Gestion de stock pour revendeurs',
    description: 'Fini Excel. Gère ton stock de revendeur en 30 secondes.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#09B1BA" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col antialiased selection:bg-[#09B1BA]/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
