# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with React + Vite
- Multi-agent chat UI (Jarvis, Dekode, Prometheus)
- Dark mode support
- Agent filtering by tabs
- Docker configuration for deployment
- README.md with project documentation
- TODO.md with implementation roadmap
- storageService (src/services/storage.js) for localStorage persistence
- Conversation management (create, select, delete)
- Message persistence (save, load, edit, delete)
- Settings persistence (theme, sidebar, agent filter)
- Import/export conversations as JSON
- Clear all data option
- messageService (src/services/messageService.js) for real-time messaging
- Agent simulation with random response delays (1-3 seconds)
- Typing indicators for agents
- Message queue management with retry logic
- Auto-scroll to new messages
- Edit and delete messages (for user messages)
- opencodeService (src/services/opencodeService.js) for OpenCode integration (mocked)
- API client configuration with authentication
- Streaming responses support (SSE-ready architecture)
- Connection state management
- Code execution placeholder
- Session management
- Express API server (Phase 1) - server/index.js with /api/responses and /api/chats endpoints
- Vite proxy configuration for API integration
- opencodeService API integration (Phase 2) - postResponse() method with retry logic

### Changed
- Migrated from custom CSS to Tailwind CSS
- Added shadcn/ui component library (Button, Input, Card, Avatar, DropdownMenu, ScrollArea, Tabs)
- Created Sidebar component with agent list and conversation selector
- Updated all components to use Tailwind classes
- ThemeContext updated to support Tailwind dark mode
- App.jsx now uses storage service for message and conversation management
- Added message service integration for agent responses

### Known Issues
- Phase 1, 2 complete (Express API + opencodeService integration)

### Next Steps
- Phase 3: Document OpenCode config (in code)
