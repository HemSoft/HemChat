'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, StopCircle } from 'lucide-react'
import { useVoice } from '@/contexts/VoiceContext'

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
}

export default function TextToSpeech({ text, autoPlay = false }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const { selectedVoiceName, voices } = useVoice()

  useEffect(() => {
    const newUtterance = new SpeechSynthesisUtterance(text)
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName)
    if (selectedVoice) {
      newUtterance.voice = selectedVoice
    }

    newUtterance.onend = () => setIsPlaying(false)
    newUtterance.onerror = () => setIsPlaying(false)
    setUtterance(newUtterance)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text, selectedVoiceName, voices])

  useEffect(() => {
    if (autoPlay && utterance && selectedVoiceName) {
      handlePlay()
    }
  }, [utterance, autoPlay, selectedVoiceName])

  const handlePlay = () => {
    if (!utterance) return

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  if (!selectedVoiceName) return null

  return (
    <div className="flex items-center gap-2">
      {isPlaying ? (
        <>
          <button
            onClick={handlePause}
            className="p-1 hover:text-blue-500 text-gray-900 dark:text-gray-100"
            title="Pause"
          >
            <Pause size={16} />
          </button>
          <button
            onClick={handleStop}
            className="p-1 hover:text-blue-500 text-gray-900 dark:text-gray-100"
            title="Stop"
          >
            <StopCircle size={16} />
          </button>
        </>
      ) : (
        <button
          onClick={handlePlay}
          className="p-1 hover:text-blue-500 text-gray-900 dark:text-gray-100"
          title="Play"
        >
          <Play size={16} />
        </button>
      )}
    </div>
  )
} 