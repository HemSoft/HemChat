import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { VoiceProvider } from '@/contexts/VoiceContext'
import { ModelProvider } from '@/contexts/ModelContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HemChat',
  description: 'A chat application with text-to-speech capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen`}>
        <ModelProvider>
          <VoiceProvider>
            {children}
          </VoiceProvider>
        </ModelProvider>
      </body>
    </html>
  )
} 