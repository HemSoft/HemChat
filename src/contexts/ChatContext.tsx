'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export type Message = {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  savedAt?: Date
}

interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  createNewChat: () => void
  setActiveChat: (chatId: string) => void
  updateChatMessages: (chatId: string, messages: Message[]) => void
  deleteChat: (chatId: string) => void
  renameChat: (chatId: string, newTitle: string) => void
  saveChat: (chatId?: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [storedChats, setStoredChats] = useLocalStorage<Chat[]>('hemchat-conversations', [])
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChatState] = useState<Chat | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const pendingDeletion = useRef<{chatId: string, newActiveChat: Chat | null} | null>(null)

  // Load chats from localStorage on initial render only once
  useEffect(() => {
    if (!isInitialized && storedChats && storedChats.length > 0) {
      // Convert ISO date strings back to Date objects
      const parsedChats = storedChats.map(chat => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        savedAt: chat.savedAt ? new Date(chat.savedAt) : undefined
      }))
      setChats(parsedChats)
      // Set the most recently saved chat as active if no active chat
      setActiveChatState(parsedChats[0])
      setIsInitialized(true)
    }
  }, [storedChats, isInitialized])

  // Memoize the storage update to prevent unnecessary re-renders
  const updateStorage = useCallback((updatedChats: Chat[]) => {
    if (isInitialized) {
      setStoredChats(updatedChats)
    }
  }, [setStoredChats, isInitialized])

  // Update localStorage when chats change, with debounce
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        if (chats.length > 0) {
          updateStorage(chats)
        } else if (storedChats.length > 0) {
          updateStorage([])
        }
      }, 300) // 300ms debounce to prevent rapid updates
      
      return () => clearTimeout(timeoutId)
    }
  }, [chats, updateStorage, storedChats.length, isInitialized])

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setChats(prevChats => [...prevChats, newChat])
    setActiveChatState(newChat)
  }, [])

  const setActiveChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setActiveChatState(chat)
    }
  }, [chats])

  const updateChatMessages = useCallback((chatId: string, messages: Message[]) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages,
              title: messages.length > 0 ? messages[0].content.slice(0, 30) + '...' : chat.title 
            }
          : chat
      )
    )
    
    setActiveChatState(prev => 
      prev && prev.id === chatId 
        ? { ...prev, messages } 
        : prev
    )
  }, [])

  const deleteChat = useCallback((chatId: string) => {
    setChats(prevChats => {
      const remainingChats = prevChats.filter(chat => chat.id !== chatId)
      
      // If we're deleting the active chat, immediately set the new active chat
      if (activeChat?.id === chatId) {
        const newActiveChat = remainingChats.length > 0 ? remainingChats[0] : null
        // Update active chat state synchronously
        setActiveChatState(newActiveChat)
      }
      
      return remainingChats
    })
  }, [activeChat])
  
  const renameChat = useCallback((chatId: string, newTitle: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle } 
          : chat
      )
    )
    
    setActiveChatState(prev => 
      prev && prev.id === chatId 
        ? { ...prev, title: newTitle } 
        : prev
    )
  }, [])

  const saveChat = useCallback((chatId?: string) => {
    const targetChatId = chatId || activeChat?.id
    if (!targetChatId) return

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === targetChatId 
          ? { ...chat, savedAt: new Date() } 
          : chat
      )
    )
    
    setActiveChatState(prev => 
      prev && prev.id === targetChatId 
        ? { ...prev, savedAt: new Date() } 
        : prev
    )
  }, [activeChat])

  const contextValue = {
    chats,
    activeChat,
    createNewChat,
    setActiveChat,
    updateChatMessages,
    deleteChat,
    renameChat,
    saveChat
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}