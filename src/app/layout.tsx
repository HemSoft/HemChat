import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HemChat - AI Chat with Voice',
  description: 'Chat with AI using Ollama and text-to-speech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 