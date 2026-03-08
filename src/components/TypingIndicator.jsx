import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import { agents } from '../data/sampleMessages'
import { cn } from '../lib/utils'

export function TypingIndicator({ agents: typingAgents }) {
  const agentNames = typingAgents.map(id => agents[id]?.name || id).join(', ')
  
  return (
    <div className="flex gap-3">
      {typingAgents.length === 1 ? (
        <AgentAvatar agentId={typingAgents[0]} size="medium" />
      ) : (
        <div className="flex -space-x-2">
          {typingAgents.slice(0, 3).map(id => (
            <AgentAvatar key={id} agentId={id} size="small" />
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-card border">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-muted-foreground">
          {typingAgents.length === 1 
            ? `${agents[typingAgents[0]]?.name} is typing...`
            : `${typingAgents.length} agents are typing...`
          }
        </span>
      </div>
    </div>
  )
}
