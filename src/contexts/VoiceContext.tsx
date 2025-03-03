'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VoiceContextType {
  selectedVoiceName: string
  setSelectedVoiceName: (name: string) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [selectedVoiceName, setSelectedVoiceName] = useState('')

  // Try to load saved preference when the provider mounts
  useEffect(() => {
    try {
      const savedVoice = globalThis?.localStorage?.getItem('selectedVoice')
      if (savedVoice) {
        setSelectedVoiceName(JSON.parse(savedVoice))
      }
    } catch (error) {
      console.warn('Error reading voice preference:', error)
    }
  }, [])

  // Try to save preference when it changes
  useEffect(() => {
    if (selectedVoiceName) {
      try {
        globalThis?.localStorage?.setItem('selectedVoice', JSON.stringify(selectedVoiceName))
      } catch (error) {
        console.warn('Error saving voice preference:', error)
      }
    }
  }, [selectedVoiceName])

  return (
    <VoiceContext.Provider value={{ selectedVoiceName, setSelectedVoiceName }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider')
  }
  return context
} 