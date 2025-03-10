'use client'

import { useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

interface ChatInterfaceProps {
  currentModel: string
}

export default function ChatInterface({ currentModel }: ChatInterfaceProps) {
  const { activeChat, updateChatMessages } = useChat()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (message: string) => {
    if (!message.trim() || !activeChat) return

    setError(null)
    const newMessages = [...(activeChat.messages || []), { role: 'user' as const, content: message }]
    updateChatMessages(activeChat.id, newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          model: currentModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      updateChatMessages(activeChat.id, [...newMessages, { role: 'assistant' as const, content: data.message }])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      setError(errorMessage)
      updateChatMessages(activeChat.id, [
        ...newMessages,
        { role: 'assistant' as const, content: errorMessage, error: true },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No active chat. Create a new chat to begin.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 relative">
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg m-4 z-50">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <ChatMessages messages={activeChat.messages} isLoading={isLoading} />
      </div>
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  )
} 