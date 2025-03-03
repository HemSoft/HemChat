'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VoiceContextType {
  selectedVoiceName: string
  setSelectedVoiceName: (name: string) => void
  autoSpeak: boolean
  setAutoSpeak: (auto: boolean) => void
  voices: SpeechSynthesisVoice[]
  setVoices: (voices: SpeechSynthesisVoice[]) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // Try to load saved preferences when the provider mounts
  useEffect(() => {
    try {
      const savedVoice = globalThis?.localStorage?.getItem('selectedVoice')
      if (savedVoice) {
        setSelectedVoiceName(JSON.parse(savedVoice))
      }

      const savedAutoSpeak = globalThis?.localStorage?.getItem('autoSpeak')
      if (savedAutoSpeak) {
        setAutoSpeak(JSON.parse(savedAutoSpeak))
      }
    } catch (error) {
      console.warn('Error reading preferences:', error)
    }
  }, [])

  // Try to save voice preference when it changes
  useEffect(() => {
    if (selectedVoiceName) {
      try {
        globalThis?.localStorage?.setItem('selectedVoice', JSON.stringify(selectedVoiceName))
      } catch (error) {
        console.warn('Error saving voice preference:', error)
      }
    }
  }, [selectedVoiceName])

  // Try to save auto-speak preference when it changes
  useEffect(() => {
    try {
      globalThis?.localStorage?.setItem('autoSpeak', JSON.stringify(autoSpeak))
    } catch (error) {
      console.warn('Error saving auto-speak preference:', error)
    }
  }, [autoSpeak])

  return (
    <VoiceContext.Provider 
      value={{ 
        selectedVoiceName, 
        setSelectedVoiceName,
        autoSpeak,
        setAutoSpeak,
        voices,
        setVoices
      }}
    >
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