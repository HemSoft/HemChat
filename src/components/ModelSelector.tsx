'use client'

import { useModel } from '@/contexts/ModelContext'

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useModel()

  return (
    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      <option value="gpt-4">GPT-4</option>
    </select>
  )
} 