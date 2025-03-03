import ModelSelector from './ModelSelector'
import VoiceControls from './VoiceControls'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 
      border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">HemChat</h1>
        <div className="flex items-center gap-6">
          <ModelSelector />
          <VoiceControls />
        </div>
      </div>
    </header>
  )
} 