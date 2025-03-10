import './globals.css'
import { Inter } from 'next/font/google'
import { ModelProvider } from '@/contexts/ModelContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { VoiceProvider } from '@/contexts/VoiceContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HemChat',
  description: 'A modern chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900`}>
        <ModelProvider>
          <VoiceProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </VoiceProvider>
        </ModelProvider>
      </body>
    </html>
  )
} 