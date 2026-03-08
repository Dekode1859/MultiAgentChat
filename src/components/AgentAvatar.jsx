import React from 'react'
import { agents } from '../data/sampleMessages'

export function AgentAvatar({ agentId, size = 'medium' }) {
  const agent = agents[agentId] || agents.user
  
  const sizeClasses = {
    small: 'h-8 w-8 text-xs',
    medium: 'h-10 w-10 text-sm',
    large: 'h-12 w-12 text-base'
  }
  
  return (
    <div 
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 font-bold shrink-0`}
      style={{
        backgroundColor: `${agent.color}20`,
        borderColor: agent.color,
        boxShadow: `0 0 12px ${agent.glow}`,
        color: agent.color
      }}
    >
      {agent.initial}
    </div>
  )
}
