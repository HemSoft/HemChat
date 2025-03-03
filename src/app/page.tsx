'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import ModelSelector from '@/components/ModelSelector'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function Home() {
  const [currentModel, setCurrentModel] = useLocalStorage<string>(
    'selectedModel',
    'benevolentjoker/nsfwmonika:latest'
  )

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold">HemChat</h1>
        <ModelSelector onModelChange={setCurrentModel} />
      </header>
      <div className="flex-1 min-h-0">
        <ChatInterface currentModel={currentModel} />
      </div>
    </div>
  )
} 