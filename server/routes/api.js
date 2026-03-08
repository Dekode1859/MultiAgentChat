import express from 'express'

const router = express.Router()

// In-memory stores
const responses = new Map()
const chats = new Map()

// POST /api/responses - Receive OpenCode response chunks
router.post('/responses', (req, res) => {
  const { chatId, agentId, chunk, done, timestamp } = req.body
  
  if (!chatId || !agentId) {
    return res.status(400).json({ error: 'chatId and agentId are required' })
  }

  if (!responses.has(chatId)) {
    responses.set(chatId, [])
  }

  const response = {
    id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    agentId,
    chunk: chunk || '',
    done: done || false,
    timestamp: timestamp || new Date().toISOString()
  }

  responses.get(chatId).push(response)
  
  res.json({ success: true, responseId: response.id })
})

// GET /api/responses/:chatId - Poll for new responses
router.get('/responses/:chatId', (req, res) => {
  const { chatId } = req.params
  const { since } = req.query

  if (!responses.has(chatId)) {
    return res.json({ responses: [], chatId })
  }

  let chatResponses = responses.get(chatId)

  if (since) {
    chatResponses = chatResponses.filter(r => r.id > since)
  }

  res.json({ responses: chatResponses, chatId })
})

// GET /api/chats - List all chat IDs
router.get('/chats', (req, res) => {
  const chatList = Array.from(chats.keys()).map(id => ({
    id,
    ...chats.get(id)
  }))
  res.json({ chats: chatList })
})

// POST /api/chats - Create new chat
router.post('/chats', (req, res) => {
  const { id } = req.body
  const chatId = id || `chat_${Date.now()}`

  if (chats.has(chatId)) {
    return res.status(409).json({ error: 'Chat already exists' })
  }

  chats.set(chatId, {
    id: chatId,
    createdAt: new Date().toISOString()
  })

  res.json({ success: true, chatId })
})

// DELETE /api/chats/:chatId - Delete chat
router.delete('/chats/:chatId', (req, res) => {
  const { chatId } = req.params

  if (!chats.has(chatId)) {
    return res.status(404).json({ error: 'Chat not found' })
  }

  chats.delete(chatId)
  responses.delete(chatId)

  res.json({ success: true, chatId })
})

export default router
