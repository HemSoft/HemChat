'use client'

import { useModel } from '@/contexts/ModelContext'
import { useChat } from '@/contexts/ChatContext'
import ChatInterface from '@/components/ChatInterface'
import { Header } from '@/components/Header'
import ChatSidebar from '@/components/ChatSidebar'

export default function Home() {
  const { selectedModel } = useModel()
  const { activeChat, createNewChat } = useChat()

  // Create a new chat if there isn't an active one
  if (!activeChat) {
    createNewChat()
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 min-h-0 flex">
        <ChatSidebar />
        <div className="flex-1">
          <ChatInterface currentModel={selectedModel} />
        </div>
      </div>
    </main>
  )
} 