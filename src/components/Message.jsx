import React, { useState } from 'react'
import { AgentAvatar } from './AgentAvatar'
import { agents } from '../data/sampleMessages'
import { formatTime } from '../utils/timeFormat'
import { Edit2, Trash2, Check, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function Message({ message, onEdit, onDelete }) {
  const agent = agents[message.agentId] || agents.user
  const isUser = message.agentId === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const handleSave = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
      <div 
        className="flex-1 max-w-[80%] rounded-lg p-4 bg-card border-l-4 relative"
        style={{ borderLeftColor: agent.color }}
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="font-semibold text-sm" style={{ color: agent.color }}>
            {agent.name}
          </span>
          <div className="flex items-center gap-2">
            {message.edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSave()
                }
                if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
              className="min-h-[60px]"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
        )}

        {isUser && !isEditing && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete && onDelete(message.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
    </div>
  )
}
