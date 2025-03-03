'use client'

import { useState, useCallback, useEffect } from 'react'
import { useVoice } from '@/contexts/VoiceContext'

interface TextToSpeechProps {
  text: string
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

export default function TextToSpeech({
  text,
  onStart,
  onEnd,
  onError,
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { selectedVoiceName, voices, autoSpeak } = useVoice()

  const selectedVoice = voices.find(voice => voice.name === selectedVoiceName) || null

  // Memoize the speak function to prevent recreating it on every render
  const speak = useCallback(() => {
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
  }, [text, selectedVoice, onStart, onEnd, onError])

  // Handle autoplay
  useEffect(() => {
    if (autoSpeak && text && !isSpeaking && selectedVoice) {
      speak()
    }
  }, [autoSpeak, text, isSpeaking, selectedVoice, speak])

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <div className="flex justify-end">
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