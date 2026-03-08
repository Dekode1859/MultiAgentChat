import React, { useEffect, useRef } from 'react'
import { Message } from './Message'
import { ScrollArea } from './ui/scroll-area'

export function ChatArea({ messages }) {
  const endRef = useRef(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full py-20">
            <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <Message key={msg.id} message={msg} />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
