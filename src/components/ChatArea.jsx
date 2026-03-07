import React, { useEffect, useRef } from 'react'
import { Message } from './Message'
import './ChatArea.css'

export function ChatArea({ messages }) {
  const endRef = useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <div className="chat-area__empty">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="chat-area__messages">
          {messages.map(msg => (
            <Message key={msg.id} message={msg} />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  )
}
