import React, { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { ChatArea } from './components/ChatArea'
import { InputArea } from './components/InputArea'
import { Sidebar } from './components/Sidebar'
import { storageService } from './services/storage'
import { messageService } from './services/messageService'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeConversationId, setActiveConversationId] = useState(() => 
    storageService.getActiveConversationId()
  )
  const [conversations, setConversations] = useState(() => 
    storageService.getConversations()
  )
  const [typingAgents, setTypingAgents] = useState([])

  useEffect(() => {
    const conversation = storageService.getConversation(activeConversationId)
    if (conversation) {
      setMessages(conversation.messages)
    }
  }, [activeConversationId])

  useEffect(() => {
    const settings = storageService.getSettings()
    setActiveFilter(settings.agentFilter)
  }, [])

  useEffect(() => {
    const unsubscribe = messageService.subscribe((event, data) => {
      if (event === 'agentTyping') {
        setTypingAgents(prev => {
          if (data.isTyping && !prev.includes(data.agentId)) {
            return [...prev, data.agentId]
          } else if (!data.isTyping) {
            return prev.filter(id => id !== data.agentId)
          }
          return prev
        })
      }
      
      if (event === 'agentResponse') {
        setMessages(prev => {
          const updated = [...prev, data]
          storageService.addMessage(activeConversationId, data)
          return updated
        })
      }
    })

    return () => unsubscribe()
  }, [activeConversationId])

  const handleSendMessage = useCallback((text) => {
    const newMessage = {
      id: `user_${Date.now()}`,
      agentId: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => {
      const updated = [...prev, newMessage]
      storageService.addMessage(activeConversationId, newMessage)
      return updated
    })
    
    messageService.addToQueue({
      ...newMessage,
      status: 'sending'
    })
  }, [activeConversationId])

  const handleEditMessage = useCallback((messageId, newContent) => {
    storageService.updateMessage(activeConversationId, messageId, newContent)
    setMessages(prev => 
      prev.map(m => 
        m.id === messageId 
          ? { ...m, content: newContent, edited: true, editedAt: new Date().toISOString() }
          : m
      )
    )
  }, [activeConversationId])

  const handleDeleteMessage = useCallback((messageId) => {
    storageService.deleteMessage(activeConversationId, messageId)
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }, [activeConversationId])

  const handleCreateConversation = useCallback(() => {
    const newConv = storageService.createConversation()
    setConversations(storageService.getConversations())
    setActiveConversationId(newConv.id)
    setMessages([])
  }, [])

  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id)
    storageService.setActiveConversationId(id)
    const conversation = storageService.getConversation(id)
    if (conversation) {
      setMessages(conversation.messages)
    }
  }, [])

  const filteredMessages = activeFilter === 'all' 
    ? messages 
    : messages.filter(m => m.agentId === activeFilter)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        <ChatArea 
          messages={filteredMessages} 
          typingAgents={typingAgents}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default App
