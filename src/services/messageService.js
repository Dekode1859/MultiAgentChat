import { agents } from '../data/sampleMessages'

const AGENT_RESPONSES = {
  jarvis: [
    "I'm analyzing your request. What specific details would you like me to focus on?",
    "Processing your query. I've identified several relevant data points.",
    "System check complete. How may I further assist you?",
    "I've compiled the information you requested. Let me know if you need more details.",
  ],
  dekode: [
    "Analyzing the patterns... Found some interesting correlations.",
    "My analysis indicates multiple approaches are viable here.",
    "Breaking down the problem: the core issue seems to be...",
    "I've decoded the complexity. Here's what I found:",
  ],
  prometheus: [
    "I've prepared a solution. Let me walk you through the implementation.",
    "Planning phase complete. Ready to execute when you are.",
    "I've drafted some code options for you to consider.",
    "The architecture looks solid. Shall I proceed with the build?",
  ]
}

class MessageService {
  constructor() {
    this.messageQueue = []
    this.isProcessing = false
    this.typingAgents = new Set()
    this.listeners = new Set()
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  emit(event, data) {
    this.listeners.forEach(callback => callback(event, data))
  }

  async addToQueue(message) {
    this.messageQueue.push({
      ...message,
      status: 'pending',
      retryCount: 0
    })
    this.emit('queueUpdated', this.messageQueue)
    
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  async processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return
    }

    this.isProcessing = true
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue[0]
      
      try {
        await this.processMessage(message)
        this.messageQueue.shift()
        this.emit('queueUpdated', this.messageQueue)
      } catch (error) {
        if (message.retryCount < 3) {
          message.retryCount++
          this.emit('messageFailed', { message, error })
          await this.delay(1000 * message.retryCount)
        } else {
          message.status = 'failed'
          this.messageQueue.shift()
          this.emit('messageFailed', { message, error: new Error('Max retries exceeded') })
        }
      }
    }

    this.isProcessing = false
  }

  async processMessage(message) {
    this.emit('messageSending', message)
    
    const agentsToRespond = this.selectAgents(message)
    
    for (const agentId of agentsToRespond) {
      await this.simulateAgentResponse(agentId, message.content)
    }
    
    this.emit('messageSent', message)
  }

  selectAgents(userMessage) {
    const agents = ['jarvis']
    if (userMessage.toLowerCase().includes('code') || 
        userMessage.toLowerCase().includes('build') ||
        userMessage.toLowerCase().includes('implement')) {
      agents.push('prometheus')
    }
    if (userMessage.toLowerCase().includes('analyze') ||
        userMessage.toLowerCase().includes('explain') ||
        userMessage.toLowerCase().includes('understand')) {
      agents.push('dekode')
    }
    return agents
  }

  async simulateAgentResponse(agentId, userMessage) {
    this.setTyping(agentId, true)
    this.emit('agentTyping', { agentId, isTyping: true })
    
    const delay = 1000 + Math.random() * 2000
    await this.delay(delay)
    
    this.setTyping(agentId, false)
    this.emit('agentTyping', { agentId, isTyping: false })
    
    const responses = AGENT_RESPONSES[agentId]
    const responseText = responses[Math.floor(Math.random() * responses.length)]
    
    const agentMessage = {
      id: `msg_${Date.now()}_${agentId}`,
      agentId,
      content: responseText,
      timestamp: new Date().toISOString()
    }
    
    this.emit('agentResponse', agentMessage)
    return agentMessage
  }

  setTyping(agentId, isTyping) {
    if (isTyping) {
      this.typingAgents.add(agentId)
    } else {
      this.typingAgents.delete(agentId)
    }
  }

  isAgentTyping(agentId) {
    return this.typingAgents.has(agentId)
  }

  getTypingAgents() {
    return Array.from(this.typingAgents)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getQueue() {
    return this.messageQueue
  }

  clearQueue() {
    this.messageQueue = []
    this.emit('queueUpdated', this.messageQueue)
  }

  cancelMessage(messageId) {
    const index = this.messageQueue.findIndex(m => m.id === messageId)
    if (index !== -1) {
      this.messageQueue.splice(index, 1)
      this.emit('queueUpdated', this.messageQueue)
      return true
    }
    return false
  }
}

export const messageService = new MessageService()

export default messageService
