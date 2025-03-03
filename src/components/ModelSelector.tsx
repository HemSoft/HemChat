'use client'

interface ModelSelectorProps {
  currentModel: string
  onModelChange: (model: string) => void
}

const AVAILABLE_MODELS = [
  { name: 'Monika (NSFW)', id: 'benevolentjoker/nsfwmonika:latest' },
  { name: 'Vanessa (NSFW)', id: 'benevolentjoker/nsfwvanessa:latest' },
  { name: 'Adult Film Writer (NSFW)', id: 'jimscard/adult-film-screenwriter-nsfw:latest' },
  { name: 'Phi-4', id: 'phi4:latest' },
  { name: 'LLaMA 3.3', id: 'llama3.3:latest' },
  { name: 'LLaMA 3.2 Vision', id: 'llama3.2-vision:11b' },
  { name: 'DeepSeek Coder', id: 'deepseek-coder:6.7b' },
  { name: 'CodeLLaMA', id: 'codellama:7b' },
  { name: 'Qwen 2.5', id: 'qwen2.5:latest' },
  { name: 'Mistral', id: 'mistral:latest' },
  { name: 'LLaMA 3.2 (7B)', id: 'llama3.2:latest' },
  { name: 'LLaMA 3.2 (3B)', id: 'llama3.2:3b' },
  { name: 'LLaMA 3.2 (1B)', id: 'llama3.2:1b' },
  { name: 'LLaMA 3.1 (8B)', id: 'llama3.1:8b' },
  { name: 'LLaMA 3 (70B)', id: 'llama3:70b' },
  { name: 'LLaMA 3', id: 'llama3:latest' },
]

export default function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  return (
    <select
      value={currentModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
        border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1
        focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {AVAILABLE_MODELS.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  )
} 