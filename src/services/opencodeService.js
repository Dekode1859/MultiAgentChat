const OPENCODE_CONFIG = {
  baseUrl: import.meta.env.VITE_OPENCODE_URL || 'http://localhost:3001',
  apiKey: import.meta.env.VITE_OPENCODE_API_KEY || '',
  timeout: 30000,
  maxRetries: 3
}

/**
 * OpenCode Configuration for Response Streaming
 * 
 * To integrate OpenCode with this chat UI, configure OpenCode to POST
 * response chunks to the following endpoint:
 * 
 *   POST http://localhost:3001/api/responses
 * 
 * Payload format:
 * {
 *   "chatId": "conv_123",           // Conversation ID
 *   "agentId": "prometheus",        // Agent ID (prometheus, jarvis, dekode)
 *   "chunk": "Response chunk text", // Response chunk (empty string for final)
 *   "done": false,                   // Boolean - true for final chunk
 *   "timestamp": "ISO-8601"        // Optional timestamp
 * }
 * 
 * Environment variables:
 *   VITE_OPENCODE_URL - Base URL for OpenCode API (default: http://localhost:3001)
 *   VITE_OPENCODE_API_KEY - API key for authentication
 */

const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
}

class OpenCodeService {
  constructor() {
    this.baseUrl = OPENCODE_CONFIG.baseUrl
    this.apiKey = OPENCODE_CONFIG.apiKey
    this.connectionState = CONNECTION_STATES.DISCONNECTED
    this.eventListeners = new Map()
    this.currentSession = null
    this.reconnectAttempts = 0
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  setConnectionState(state) {
    this.connectionState = state
    this.emit('connectionStateChange', { state })
  }

  async connect() {
    if (this.connectionState === CONNECTION_STATES.CONNECTED) {
      return true
    }

    this.setConnectionState(CONNECTION_STATES.CONNECTING)

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(OPENCODE_CONFIG.timeout)
      })

      if (response.ok) {
        this.setConnectionState(CONNECTION_STATES.CONNECTED)
        this.reconnectAttempts = 0
        return true
      } else {
        throw new Error(`Health check failed: ${response.status}`)
      }
    } catch (error) {
      console.warn('OpenCode connection failed (using mock):', error.message)
      this.setConnectionState(CONNECTION_STATES.CONNECTED)
      return true
    }
  }

  async disconnect() {
    this.setConnectionState(CONNECTION_STATES.DISCONNECTED)
    this.currentSession = null
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    return headers
  }

  async postResponse(chatId, agentId, chunk, done = false) {
    const payload = {
      chatId,
      agentId,
      chunk,
      done,
      timestamp: new Date().toISOString()
    }

    for (let attempt = 1; attempt <= OPENCODE_CONFIG.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/responses`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(OPENCODE_CONFIG.timeout)
        })

        if (response.ok) {
          const data = await response.json()
          return data
        }
      } catch (error) {
        if (attempt === OPENCODE_CONFIG.maxRetries) {
          console.warn('Failed to POST response to API:', error.message)
        }
        await this.delay(500 * attempt)
      }
    }
    return null
  }

  async createSession(agentId = 'prometheus') {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ agentId })
      })

      if (response.ok) {
        const data = await response.json()
        this.currentSession = data.sessionId
        return data
      }
    } catch (error) {
      console.warn('Create session failed (using mock):', error.message)
    }

    this.currentSession = `mock_session_${Date.now()}`
    return { sessionId: this.currentSession, agentId }
  }

  async sendMessage(content, options = {}) {
    const {
      agentId = 'prometheus',
      stream = true,
      chatId = 'default',
      onChunk
    } = options

    await this.connect()

    if (!this.currentSession) {
      await this.createSession(agentId)
    }

    this.emit('messageStart', { content, agentId })

    if (stream) {
      return this.streamMessage(content, { agentId, chatId, onChunk })
    } else {
      return this.sendMessageDirect(content, { agentId })
    }
  }

  async streamMessage(content, { agentId, chatId, onChunk }) {
    const mockResponses = {
      prometheus: this.generateMockResponse(content, 'prometheus'),
      jarvis: this.generateMockResponse(content, 'jarvis'),
      dekode: this.generateMockResponse(content, 'dekode')
    }

    const response = mockResponses[agentId] || mockResponses.prometheus
    let fullResponse = ''
    const chunks = response.split(' ')

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '')
      fullResponse += chunk
      
      const isLast = i === chunks.length - 1
      
      if (onChunk) {
        onChunk(chunk, { done: isLast, progress: (i + 1) / chunks.length })
      }

      this.emit('streamChunk', { 
        chunk, 
        fullResponse, 
        done: isLast, 
        progress: (i + 1) / chunks.length 
      })

      await this.postResponse(chatId || 'default', agentId, chunk, isLast)

      await this.delay(50 + Math.random() * 100)
    }

    this.emit('streamChunk', { 
      chunk: '', 
      fullResponse, 
      done: true, 
      progress: 1 
    })

    this.emit('messageComplete', { 
      content: fullResponse, 
      agentId 
    })

    return {
      content: fullResponse,
      agentId,
      timestamp: new Date().toISOString()
    }
  }

  async sendMessageDirect(content, { agentId }) {
    await this.delay(500)
    
    const response = this.generateMockResponse(content, agentId)
    
    this.emit('messageComplete', { 
      content: response, 
      agentId 
    })

    return {
      content: response,
      agentId,
      timestamp: new Date().toISOString()
    }
  }

  generateMockResponse(content, agentId) {
    const responses = {
      prometheus: [
        "I've analyzed your request and prepared a solution. Here's the implementation plan:\n\n1. Set up the project structure\n2. Implement the core functionality\n3. Add tests\n4. Deploy to production",
        "I'll help you implement this. Let me create the necessary files and components for your request.",
        "The code has been generated. Here's a breakdown of what was created and how to use it."
      ],
      jarvis: [
        "I've processed your request. How may I assist you further with this task?",
        "System ready. I've analyzed the input and prepared appropriate responses.",
        "I've compiled the information you requested. What would you like to explore next?"
      ],
      dekode: [
        "Analyzing the patterns... I've identified key insights from your query.",
        "Breaking down the complexity: here's what the data reveals about your request.",
        "My analysis is complete. The solution involves understanding the underlying patterns."
      ]
    }

    const agentResponses = responses[agentId] || responses.prometheus
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  async executeCode(code, language = 'javascript') {
    this.emit('codeExecutionStart', { code, language })

    await this.delay(1000)

    const mockResult = {
      success: true,
      output: `[Mock] Code executed successfully\n\n> ${language}:\n> ${code.slice(0, 50)}...\n\nExecution time: ${Math.random() * 1000}ms`,
      error: null
    }

    this.emit('codeExecutionComplete', mockResult)
    return mockResult
  }

  getConnectionState() {
    return this.connectionState
  }

  isConnected() {
    return this.connectionState === CONNECTION_STATES.CONNECTED
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const opencodeService = new OpenCodeService()

export { CONNECTION_STATES }
export default opencodeService
