'use client'

import dynamic from 'next/dynamic'

const TextToSpeech = dynamic(() => import('./TextToSpeech'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  ),
})

type Message = {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col space-y-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.error
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 border border-red-400 dark:border-red-700'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="mb-2">{message.content}</div>
              {message.role === 'assistant' && !message.error && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                  <TextToSpeech
                    text={message.content}
                    autoPlay={false}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-[80%] rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 