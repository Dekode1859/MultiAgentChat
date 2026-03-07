import React from 'react'
import { agents } from '../data/sampleMessages'
import './AgentAvatar.css'

export function AgentAvatar({ agentId, size = 'medium' }) {
  const agent = agents[agentId] || agents.user
  
  return (
    <div 
      className={`agent-avatar agent-avatar--${size}`}
      style={{
        backgroundColor: `${agent.color}20`,
        borderColor: agent.color,
        boxShadow: `0 0 12px ${agent.glow}`
      }}
    >
      <span style={{ color: agent.color }}>{agent.initial}</span>
    </div>
  )
}
