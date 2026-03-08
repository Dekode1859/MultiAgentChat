# Sparker - Node.js PTY Spawner Service

## Overview
Real-time OpenCode CLI streaming using node-pty + Socket.io WebSocket bridge.

## Architecture
React Frontend (3000) <-> Socket.io <-> Sparker Service (3002) <-> node-pty <-> opencode

## File Structure
MultiAgentChat/
├── sparker/                    # New Node.js service
│   ├── index.js               # Express + Socket.io server
│   ├── lib/
│   │   └── ptyManager.js     # node-pty wrapper
│   └── package.json
├── src/
│   └── components/
│       └── StreamingOutput.jsx
└── Dockerfile

## Implementation Phases

### Phase 1: Sparker Service Setup
- Install: node-pty, socket.io, strip-ansi, express
- Create sparker/index.js with Express + Socket.io
- Create sparker/lib/ptyManager.js with spawnAgent(chatId)

### Phase 2: ANSI Parser
- Add strip-ansi to clean terminal output
- Regex patterns for thinking/output detection

### Phase 3: WebSocket Events
- Server emits: agent_thought_chunk, agent_output_chunk, agent_status_change
- Client can: send_message (writes to pty stdin)

### Phase 4: React Streaming Component
- Socket.io client connection
- StreamingOutput.jsx component

### Phase 5: Docker Integration
- Run both: React app (3000) + Sparker (3002)

## WebSocket Events
Server -> Client:
- agent_thought_chunk: { chatId, chunk, progress }
- agent_output_chunk: { chatId, chunk, done }
- agent_status_change: { chatId, status }

Client -> Server:
- send_message: { chatId, message }

## API Endpoints
POST /spawn - Spawn opencode process
GET  /status/:chatId - Check status
POST /input/:chatId - Send input
DELETE /kill/:chatId - Kill process

## Atomic Commits
1. feat: add sparker service with node-pty and socket.io
2. feat: add ANSI parser
3. feat: implement WebSocket streaming
4. feat: add React streaming component
5. refactor: update Docker
