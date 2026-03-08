import React, { useEffect, useRef } from 'react'
import { Message } from './Message'
import { TypingIndicator } from './TypingIndicator'
import { ScrollArea } from './ui/scroll-area'

export function ChatArea({ messages, typingAgents = [], onEditMessage, onDeleteMessage }) {
  const endRef = useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingAgents])
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && typingAgents.length === 0 ? (
          <div className="flex items-center justify-center h-full py-20">
            <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <Message 
                key={msg.id} 
                message={msg}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
              />
            ))}
            {typingAgents.length > 0 && (
              <TypingIndicator agents={typingAgents} />
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
