# MultiAgentChat Implementation Roadmap

Implementation is divided into four phases, progressing from UI enhancement to full-featured real-time chat with OpenCode integration.

---

## Phase 1: UI Enhancement

**Goal**: Modernize the UI with shadcn/ui components and Tailwind CSS, add sidebar navigation

### Tasks

- [ ] **1.1** Set up Tailwind CSS
  - Install Tailwind dependencies
  - Configure `tailwind.config.js`
  - Add Tailwind directives to `index.css`

- [ ] **1.2** Install shadcn/ui
  - Initialize shadcn/ui in the project
  - Configure components.json

- [ ] **1.3** Add shadcn/ui components
  - Button component
  - Input component
  - Card component
  - Avatar component
  - Dropdown menu (for agent filter)
  - Scroll area (for chat)

- [ ] **1.4** Create sidebar component
  - Agent list with status indicators
  - Conversation selector (future)
  - Settings link (future)
  - Collapsible on mobile

- [ ] **1.5** Migrate existing components to Tailwind
  - Refactor Header.jsx with Tailwind classes
  - Refactor ChatArea.jsx with Tailwind classes
  - Refactor Message.jsx with Tailwind classes
  - Refactor InputArea.jsx with Tailwind classes

- [ ] **1.6** Update ThemeContext for Tailwind
  - Use Tailwind's dark mode class strategy
  - Remove custom CSS dark mode variables

**Deliverable**: Modernized UI with sidebar, Tailwind styling, and shadcn/ui components

---

## Phase 2: localStorage Backend

**Goal**: Persist messages, settings, and conversation history in localStorage

### Tasks

- [ ] **2.1** Create storage service
  - `src/services/storage.js` module
  - Methods: `saveMessages`, `loadMessages`, `saveSettings`, `loadSettings`

- [ ] **2.2** Implement message persistence
  - Save new messages to localStorage on send
  - Load messages on app initialization
  - Handle storage limits gracefully

- [ ] **2.3** Implement settings persistence
  - Save theme preference (dark/light)
  - Save agent filter preference
  - Save sidebar collapsed state

- [ ] **2.4** Add conversation management
  - Save multiple conversations
  - Create new conversation
  - Switch between conversations
  - Delete conversations

- [ ] **2.5** Add storage utilities
  - Export conversation to JSON
  - Import conversation from JSON
  - Clear all data option

**Deliverable**: All app state persisted in localStorage, multiple conversations supported

---

## Phase 3: Real Messaging System

**Goal**: Implement real-time message delivery with WebSocket-ready architecture

### Tasks

- [ ] **3.1** Create message service
  - `src/services/messageService.js`
  - Message queue management
  - Retry logic for failed messages

- [ ] **3.2** Implement agent simulation
  - Random response delays (1-3 seconds)
  - Multiple agents responding to context
  - Typing indicator display

- [ ] **3.3** Add real-time message updates
  - Auto-scroll to new messages
  - New message notification (subtle highlight)
  - Message read status

- [ ] **3.4** Enhance message features
  - Edit existing messages
  - Delete messages
  - Reply to specific messages

- [ ] **3.5** Prepare for WebSocket integration
  - Abstract message service interface
  - Connection state management
  - Reconnection logic (placeholder)

**Deliverable**: Live message updates with typing indicators and simulated agent responses

---

## Phase 4: OpenCode Response Streaming

**Goal**: Integrate OpenCode for real code execution and streaming responses

### Tasks

- [ ] **4.1** Set up OpenCode integration
  - Create `src/services/opencodeService.js`
  - API client configuration
  - Authentication handling

- [ ] **4.2** Implement streaming responses
  - Server-Sent Events (SSE) or WebSocket for streaming
  - Chunked message rendering
  - Streaming indicator

- [ ] **4.3** Add code execution features
  - Code block detection in messages
  - Execute code button
  - Display execution results

- [ ] **4.4** Enhance code display
  - Syntax highlighting (using Prism or Shiki)
  - Copy code button
  - Language detection

- [ ] **4.5** Agent-specific behaviors
  - Prometheus: handles planning and code execution
  - Jarvis: orchestrates and routes queries
  - Dekode: handles analysis and explanations

**Deliverable**: Full OpenCode integration with streaming responses and code execution

---

## Notes

- Each phase builds upon the previous—complete Phase 1 before Phase 2, etc.
- Phases can be worked on in parallel by splitting tasks among team members
- Some tasks may be broken down further during implementation
- API keys and credentials should be stored in environment variables, not in code

---

## Changelog Requirement (Mandatory)

Every implementation session MUST:

1. **Update CHANGELOG.md before committing** with:
   - What was changed/implemented
   - What's working now
   - What's still broken/pending
   - Any important notes

2. **Reference CHANGELOG.md** when starting new sessions:
   - Read it first to understand current state
   - Build upon previous work, not redo

3. **Commit format**: Clear messages about what changed

Example CHANGELOG entry:


This ensures continuity between sessions and provides history.
