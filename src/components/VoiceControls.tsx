'use client'

import { useEffect } from 'react'
import { useVoice } from '@/contexts/VoiceContext'

export default function VoiceControls() {
  const { 
    selectedVoiceName, 
    setSelectedVoiceName,
    autoSpeak,
    setAutoSpeak,
    voices,
    setVoices
  } = useVoice()

  // Handle voice loading and initialization
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      
      // Only set default voice if no voice is selected and we have voices available
      if (!selectedVoiceName && availableVoices.length > 0) {
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
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [selectedVoiceName, setSelectedVoiceName, setVoices])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="voice-select" className="text-sm font-medium">Voice:</label>
        <select
          id="voice-select"
          value={selectedVoiceName}
          onChange={(e) => setSelectedVoiceName(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-w-[200px]"
        >
          <option value="">Select a voice</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="auto-speak"
          checked={autoSpeak}
          onChange={(e) => setAutoSpeak(e.target.checked)}
          className="h-4 w-4 text-blue-500 rounded border-gray-300 
            dark:border-gray-600 focus:ring-blue-500"
        />
        <label htmlFor="auto-speak" className="text-sm font-medium">
          Auto-speak responses
        </label>
      </div>
    </div>
  )
} 