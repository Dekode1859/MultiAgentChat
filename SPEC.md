# MultiAgentChat - Project Plan

## 1. Project Overview

**Name:** MultiAgentChat  
**Type:** React Web Application (Vite)  
**Purpose:** Multi-agent group chat UI where Jarvis orchestrates, Dekode inputs, and OpenCode/Prometheus executes

## 2. UI/UX Specification

### Agent Identities
| Agent | Color | Role |
|-------|-------|------|
| Jarvis | #58a6ff (blue) | Orchestrator - sends prompts to OpenCode |
| Dekode | #7ee787 (green) | User - provides requirements |
| Prometheus | #f778ba (pink) | OpenCode agent - executes plans |

### Layout
- Header: 60px, agent filter tabs + dark mode toggle
- Chat Area: Scrollable, fills viewport
- Input Area: 80px, text input + send button

### Colors (Dark Mode)
- Background: #0d1117
- Cards: #161b22
- Input: #21262d
- Text: #e6edf3 / #8b949e

## 3. File Structure


## 4. Implementation Phases (Atomic Commits)

### Phase 1: Project Setup ✅ (done)
- [x] Initialize project structure
- [x] package.json, vite.config.js, index.html
- [x] npm install

### Phase 2: Core Components ✅ (done)
- [x] App.jsx - main layout
- [x] Message.jsx - message bubble with agent info
- [x] Header.jsx - tabs and theme toggle
- [x] InputArea.jsx - user input
- [x] ChatArea.jsx - message list
- [x] AgentAvatar.jsx - avatar component

### Phase 3: Styling
- [ ] ThemeContext.jsx - dark/light mode
- [ ] CSS for all components
- [ ] Responsive design

### Phase 4: Data & Utils
- [ ] sampleMessages.js - demo data
- [ ] timeFormat.js - timestamp formatting

### Phase 5: Docker
- [ ] Dockerfile (Node build → Nginx serve)
- [ ] docker-compose.yml
- [ ] nginx.conf

### Phase 6: Testing & Commit
- [ ] npm run build test
- [ ] Docker build test
- [ ] Commit all with atomic messages

## 5. Deployment Strategy

### Build


### Cloudflare Tunnel (for public access)
1. Container exposes port 3000
2. cloudflared tunnel routes traffic
3. Zero Trust dashboard manages domain
4. Ask Dekode for tunnel token when deploying

### Deployment Steps
1. Build Docker: 
2. Run: 
3. Test: 
4. Deploy tunnel: Ask for token, then 

## 6. Git Workflow

### Commit Guidelines
- One feature per commit
- Working code only
- Descriptive messages
- Commit after each phase

### First Commits (example)


## 7. Acceptance Criteria

- [ ] React app builds without errors
- [ ] All three agents visible with distinct colors
- [ ] Messages display with avatar, name, timestamp
- [ ] User can type and send messages
- [ ] Agent filter tabs work
- [ ] Dark/light mode toggle works
- [ ] Docker builds and runs
- [ ] App accessible on localhost:3000
