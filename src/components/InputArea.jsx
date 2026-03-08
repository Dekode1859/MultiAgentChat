import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send } from 'lucide-react'

export function InputArea({ onSendMessage }) {
  const [text, setText] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onSendMessage(text.trim())
      setText('')
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  return (
    <form className="flex gap-2 p-4 border-t bg-card" onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button type="submit" disabled={!text.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
