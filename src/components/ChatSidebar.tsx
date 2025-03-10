'use client'
import { useChat } from '@/contexts/ChatContext'
import { PlusCircle, MessageSquare, Trash2, Pencil, Check, X, Save } from 'lucide-react'
import { useState } from 'react'

export default function ChatSidebar() {
  const { chats, activeChat, createNewChat, setActiveChat, deleteChat, renameChat, saveChat } = useChat()
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [justSaved, setJustSaved] = useState<string | null>(null)

  const handleEditClick = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const handleSaveTitle = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim())
    }
    setEditingChatId(null)
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(null)
  }

  const handleSaveChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    saveChat(chatId)
    // Show saved indicator briefly
    setJustSaved(chatId)
    setTimeout(() => {
      setJustSaved(null)
    }, 1500)
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 h-full flex flex-col border-r border-gray-200 dark:border-gray-800">
      <button
        onClick={createNewChat}
        className="flex items-center gap-2 m-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <PlusCircle size={20} />
        <span>New Chat</span>
      </button>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 group ${
              activeChat?.id === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MessageSquare size={18} />
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTitle(chat.id, e as any);
                    } else if (e.key === 'Escape') {
                      handleCancelEdit(e as any);
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{chat.title}</span>
                  {justSaved === chat.id && (
                    <span className="text-xs text-green-600 dark:text-green-400">Saved!</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {editingChatId === chat.id ? (
                <>
                  <button
                    onClick={(e) => handleSaveTitle(chat.id, e)}
                    className="p-1 mr-1 hover:text-green-500"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 mr-1 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => handleSaveChat(chat.id, e)}
                    className="p-1 mr-1 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Save conversation"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={(e) => handleEditClick(chat.id, chat.title, e)}
                    className="p-1 mr-1 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rename chat"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    className="p-1 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}