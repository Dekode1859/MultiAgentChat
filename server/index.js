import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/api.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.API_PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api', apiRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  
  // Handle React router - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (${NODE_ENV})`)
})

export default app
