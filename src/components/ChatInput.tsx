'use client'

import { useState, FormEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="container max-w-4xl mx-auto p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
              border-gray-300 dark:border-gray-600
              placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 