'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

export default function TextToSpeech({
  text,
  autoPlay = false,
  onStart,
  onEnd,
  onError,
}: TextToSpeechProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useLocalStorage<string>('selectedVoice', '')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const selectedVoice = voices.find(voice => voice.name === selectedVoiceName) || null

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      
      // Only set default voice if no voice is selected
      if (!selectedVoiceName) {
        // Try to find a female English voice
        const femaleVoice = availableVoices.find(
          (voice) => voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
        )
        // Fallback to any English voice
        const englishVoice = availableVoices.find((voice) => voice.lang.includes('en'))
        // Final fallback to any voice
        const defaultVoice = femaleVoice || englishVoice || availableVoices[0]
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name)
        }
      }
    }

    // Load voices immediately
    loadVoices()

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [selectedVoiceName, setSelectedVoiceName])

  useEffect(() => {
    if (autoPlay && text && !isSpeaking) {
      speak()
    }
  }, [text, autoPlay])

  const speak = () => {
    if (!text || !selectedVoice) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = selectedVoice
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      onStart?.()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }

    utterance.onerror = (event) => {
      setIsSpeaking(false)
      onError?.(event.error)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedVoiceName}
        onChange={(e) => {
          setSelectedVoiceName(e.target.value)
        }}
        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
      <button
        onClick={isSpeaking ? stop : speak}
        disabled={!text || voices.length === 0}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpeaking ? 'Stop' : 'Speak'}
      </button>
    </div>
  )
} 