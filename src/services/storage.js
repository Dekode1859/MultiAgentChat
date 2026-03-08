import { initialMessages } from '../data/sampleMessages'

const STORAGE_KEYS = {
  MESSAGES: 'mac_messages',
  SETTINGS: 'mac_settings',
  CONVERSATIONS: 'mac_conversations',
  ACTIVE_CONVERSATION: 'mac_active_conversation'
}

const DEFAULT_SETTINGS = {
  theme: 'dark',
  sidebarCollapsed: false,
  agentFilter: 'all'
}

const DEFAULT_CONVERSATION = {
  id: 'default',
  name: 'New Chat',
  messages: initialMessages,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const storageService = {
  getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      return true
    } catch (e) {
      console.error('Failed to save settings:', e)
      return false
    }
  },

  getConversations() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
      if (saved) {
        return JSON.parse(saved)
      }
      return [DEFAULT_CONVERSATION]
    } catch {
      return [DEFAULT_CONVERSATION]
    }
  },

  saveConversations(conversations) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))
      return true
    } catch (e) {
      console.error('Failed to save conversations:', e)
      return false
    }
  },

  getActiveConversationId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVERSATION) || 'default'
  },

  setActiveConversationId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVERSATION, id)
  },

  getConversation(id) {
    const conversations = this.getConversations()
    return conversations.find(c => c.id === id) || conversations[0]
  },

  createConversation(name = 'New Chat') {
    const conversations = this.getConversations()
    const newConversation = {
      id: `conv_${Date.now()}`,
      name,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    conversations.push(newConversation)
    this.saveConversations(conversations)
    return newConversation
  },

  updateConversation(id, updates) {
    const conversations = this.getConversations()
    const index = conversations.findIndex(c => c.id === id)
    if (index !== -1) {
      conversations[index] = {
        ...conversations[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.saveConversations(conversations)
      return conversations[index]
    }
    return null
  },

  deleteConversation(id) {
    const conversations = this.getConversations()
    if (conversations.length <= 1) {
      return false
    }
    const filtered = conversations.filter(c => c.id !== id)
    this.saveConversations(filtered)
    if (this.getActiveConversationId() === id) {
      this.setActiveConversationId(filtered[0].id)
    }
    return true
  },

  addMessage(conversationId, message) {
    const conversation = this.getConversation(conversationId)
    if (conversation) {
      conversation.messages.push({
        ...message,
        id: conversation.messages.length + 1,
        timestamp: message.timestamp || new Date().toISOString()
      })
      conversation.updatedAt = new Date().toISOString()
      this.updateConversation(conversationId, { messages: conversation.messages })
      return true
    }
    return false
  },

  updateMessage(conversationId, messageId, content) {
    const conversation = this.getConversation(conversationId)
    if (conversation) {
      const msgIndex = conversation.messages.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        conversation.messages[msgIndex].content = content
        conversation.messages[msgIndex].edited = true
        conversation.messages[msgIndex].editedAt = new Date().toISOString()
        this.updateConversation(conversationId, { messages: conversation.messages })
        return true
      }
    }
    return false
  },

  deleteMessage(conversationId, messageId) {
    const conversation = this.getConversation(conversationId)
    if (conversation) {
      conversation.messages = conversation.messages.filter(m => m.id !== messageId)
      this.updateConversation(conversationId, { messages: conversation.messages })
      return true
    }
    return false
  },

  exportConversation(id) {
    const conversation = this.getConversation(id)
    return conversation ? JSON.stringify(conversation, null, 2) : null
  },

  importConversation(jsonString) {
    try {
      const conversation = JSON.parse(jsonString)
      conversation.id = `conv_${Date.now()}`
      conversation.createdAt = new Date().toISOString()
      conversation.updatedAt = new Date().toISOString()
      const conversations = this.getConversations()
      conversations.push(conversation)
      this.saveConversations(conversations)
      return conversation
    } catch (e) {
      console.error('Failed to import conversation:', e)
      return null
    }
  },

  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES)
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS)
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION)
      return true
    } catch {
      return false
    }
  }
}

export default storageService
