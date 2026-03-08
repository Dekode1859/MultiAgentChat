import React, { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { ChatArea } from './components/ChatArea'
import { InputArea } from './components/InputArea'
import { Sidebar } from './components/Sidebar'
import { storageService } from './services/storage'
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

  const handleSendMessage = useCallback((text) => {
    const newMessage = {
      id: Date.now(),
      agentId: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => {
      const updated = [...prev, newMessage]
      storageService.addMessage(activeConversationId, newMessage)
      return updated
    })
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
        <ChatArea messages={filteredMessages} />
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default App
