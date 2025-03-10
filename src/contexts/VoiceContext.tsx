'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VoiceContextType {
  selectedVoiceName: string
  setSelectedVoiceName: (name: string) => void
  voices: SpeechSynthesisVoice[]
  setVoices: (voices: SpeechSynthesisVoice[]) => void
  autoSpeak: boolean
  setAutoSpeak: (autoSpeak: boolean) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [autoSpeak, setAutoSpeak] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedVoice = localStorage.getItem('selectedVoice')
    const savedAutoSpeak = localStorage.getItem('autoSpeak')
    if (savedVoice) setSelectedVoiceName(savedVoice)
    if (savedAutoSpeak) setAutoSpeak(savedAutoSpeak === 'true')
  }, [])

  useEffect(() => {
    // Save preferences
    localStorage.setItem('selectedVoice', selectedVoiceName)
    localStorage.setItem('autoSpeak', String(autoSpeak))
  }, [selectedVoiceName, autoSpeak])

  return (
    <VoiceContext.Provider
      value={{
        selectedVoiceName,
        setSelectedVoiceName,
        voices,
        setVoices,
        autoSpeak,
        setAutoSpeak,
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