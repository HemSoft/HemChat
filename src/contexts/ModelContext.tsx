'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ModelContextType = {
  selectedModel: string
  setSelectedModel: (model: string) => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')

  useEffect(() => {
    const savedModel = localStorage.getItem('selectedModel')
    if (savedModel) {
      setSelectedModel(savedModel)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel)
  }, [selectedModel])

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider')
  }
  return context
} 