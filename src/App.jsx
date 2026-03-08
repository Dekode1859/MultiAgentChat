import React, { useState } from 'react'
import { Header } from './components/Header'
import { ChatArea } from './components/ChatArea'
import { InputArea } from './components/InputArea'
import { Sidebar } from './components/Sidebar'
import { initialMessages } from './data/sampleMessages'
import './App.css'

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [activeFilter, setActiveFilter] = useState('all')
  
  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      agentId: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }
  
  const filteredMessages = activeFilter === 'all' 
    ? messages 
    : messages.filter(m => m.agentId === activeFilter)
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
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
