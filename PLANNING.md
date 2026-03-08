# OpenCode Response Streaming - Implementation Plan

## Overview

Stream OpenCode responses to the React web UI via a built-in Express API server. OpenCode instances POST responses to the web UI, which updates the UI in real-time via polling.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      React + Express App                         │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐   │
│  │   Express   │    │   React     │    │  localStorage    │   │
│  │   API (3001) │◄───│   UI (3000) │───►│  (Messages)      │   │
│  └─────────────┘    └─────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         ▲                    │
         │ POST               │ Polls
         │                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OpenCode Engine                               │
│    (runs on same server, POSTs /api/responses to web UI)       │
└─────────────────────────────────────────────────────────────────┘
```

## Current State

- React 18 + Vite (dev: 5173, prod: nginx on 3000)
- Express API **not present** in React app
- `opencodeService.js` - mock-based streaming (frontend)
- `messageService.js` - queue-based agent responses
- `storage.js` - localStorage for conversations/messages
- Docker: single nginx container serving static build

---

## Implementation Phases

### Phase 1: Add Express API Server to React App

**Files Changed:**
- `package.json` - add Express
- Create `server/index.js` - Express API
- Create `server/routes/api.js` - API routes

**API Endpoints:**
```
POST /api/responses          - Receive OpenCode response chunks
GET  /api/responses/:chatId - Poll for new responses (with lastId)
GET  /api/chats              - List all chat IDs
POST /api/chats              - Create new chat
DELETE /api/chats/:chatId    - Delete chat
```

**Atomic Commit:**
```
feat: add Express API server for OpenCode response streaming

- Add express, cors, body-parser dependencies
- Create server/index.js with Express app
- Create /api/responses, /api/chats endpoints
- Add Vite proxy config for dev
```

---

### Phase 2: Update opencodeService for API Integration

**Files Changed:**
- `src/services/opencodeService.js`

**Changes:**
- Add `postResponse(chatId, chunk)` method to POST to API
- Update `streamMessage` to POST each chunk
- Add error handling and retry logic for POST failures

**Atomic Commit:**
```
feat: integrate opencodeService with Express API

- Add postResponse() to send chunks to /api/responses
- Update streamMessage to POST instead of mock emit
- Add retry logic for failed POSTs
```

---

### Phase 3: OpenCode POST Integration

**Files Changed:**
- Add configuration for OpenCode callback URL

**Changes:**
- OpenCode config should POST to: `http://localhost:3001/api/responses`
- Payload format:
```json
{
  "chatId": "conv_123",
  "agentId": "prometheus", 
  "chunk": "Response chunk text",
  "done": false,
  "timestamp": "ISO-8601"
}
```

**Atomic Commit:**
```
feat: configure OpenCode to POST responses to web API

- Document POST endpoint format
- Add OpenCode callback URL configuration
```

---

### Phase 4: UI Real-time Updates (Polling)

**Files Changed:**
- `src/services/messageService.js`
- `src/App.jsx`

**Changes:**
- Add polling mechanism (every 2s) to fetch new responses
- Update `messageService` to fetch from `/api/responses/:chatId`
- Emit events to update UI when new responses arrive
- Integrate with existing message flow

**Atomic Commit:**
```
feat: add polling for real-time UI updates

- Add pollForResponses() in messageService
- Update App.jsx to start/stop polling on conversation change
- Debounce polling to prevent excessive requests
```

---

### Phase 5: Docker Configuration

**Files Changed:**
- `Dockerfile`
- `docker-compose.yml`

**Changes:**
- Multi-stage build: Node builds React, then serves via Express
- Remove nginx, use Express for both API and static
- Update docker-compose for port 3001 (API)

**Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["node", "server/index.js"]
```

**docker-compose.yml:**
```yaml
services:
  web:
    build: .
    ports:
      - "3000:3001"   # host:container
    environment:
      - NODE_ENV=production
```

**Atomic Commit:**
```
refactor: update Docker for Express server

- Update Dockerfile to serve via Express (not nginx)
- Update docker-compose to expose port 3001
- Remove nginx.conf dependency
```

---

## Message Flow

1. **User sends message** → stored in localStorage via `storageService`
2. **OpenCode receives** → processes request
3. **OpenCode POSTs** → `/api/responses` with chunks
4. **Express saves** → to in-memory store (or localStorage)
5. **UI polls** → `/api/responses/:chatId?since=lastId`
6. **MessageService emits** → `agentResponse` event
7. **App updates** → React re-renders with new messages

---

## Configuration

**Environment Variables:**
```env
VITE_API_URL=http://localhost:3001
API_PORT=3001
NODE_ENV=development
```

**OpenCode Configuration:**
```json
{
  "callbackUrl": "http://localhost:3001/api/responses"
}
```

---

## Acceptance Criteria

- [ ] Express API runs on port 3001 alongside React dev server
- [ ] OpenCode can POST to `/api/responses` successfully
- [ ] UI polls and displays new responses within 2 seconds
- [ ] Multiple chat IDs are supported
- [ ] Messages persist in localStorage (existing behavior preserved)
- [ ] Docker builds and runs with both API and UI
- [ ] Polling debounces to prevent excessive requests

---

## File Structure After Implementation

```
MultiAgentChat/
├── server/
│   ├── index.js           # Express server entry
│   └── routes/
│       └── api.js         # API route handlers
├── src/
│   ├── services/
│   │   ├── opencodeService.js  # Updated for API
│   │   ├── messageService.js    # Updated for polling
│   │   └── storage.js           # Unchanged
│   └── ...
├── Dockerfile             # Updated for Express
├── docker-compose.yml    # Updated ports
├── package.json          # Added express
└── PLANNING.md          # This file
```

---

## Implementation Order

1. Phase 1 - Express API (foundation)
2. Phase 2 - opencodeService updates
3. Phase 3 - OpenCode configuration (documented)
4. Phase 4 - Polling in UI
5. Phase 5 - Docker changes

Each phase = 1 atomic commit.
