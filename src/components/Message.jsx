import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import { agents } from '../data/sampleMessages'
import { formatTime } from '../utils/timeFormat'

export function Message({ message }) {
  const agent = agents[message.agentId] || agents.user
  const isUser = message.agentId === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
      <div 
        className="flex-1 max-w-[80%] rounded-lg p-4 bg-card border-l-4"
        style={{ borderLeftColor: agent.color }}
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="font-semibold text-sm" style={{ color: agent.color }}>
            {agent.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
      {isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
    </div>
  )
}
