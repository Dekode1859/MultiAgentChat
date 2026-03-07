import React from 'react'
import { AgentAvatar } from './AgentAvatar'
import { agents } from '../data/sampleMessages'
import { formatTime } from '../utils/timeFormat'
import './Message.css'

export function Message({ message }) {
  const agent = agents[message.agentId] || agents.user
  const isUser = message.agentId === 'user'
  
  return (
    <div className={`message ${isUser ? 'message--user' : ''}`}>
      {!isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
      <div 
        className="message__content"
        style={{ borderLeftColor: agent.color }}
      >
        <div className="message__header">
          <span className="message__name" style={{ color: agent.color }}>
            {agent.name}
          </span>
          <span className="message__time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="message__text">
          {message.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
      {isUser && (
        <AgentAvatar agentId={message.agentId} size="medium" />
      )}
    </div>
  )
}
