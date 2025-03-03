'use client'

import { useModel } from '@/contexts/ModelContext'
import ChatInterface from '@/components/ChatInterface'
import { Header } from '@/components/Header'

export default function Home() {
  const { selectedModel } = useModel()

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 min-h-0">
        <ChatInterface currentModel={selectedModel} />
      </div>
    </main>
  )
} 