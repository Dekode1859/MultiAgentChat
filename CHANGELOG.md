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

### Changed
- Migrated from custom CSS to Tailwind CSS
- Added shadcn/ui component library (Button, Input, Card, Avatar, DropdownMenu, ScrollArea, Tabs)
- Created Sidebar component with agent list and conversation selector
- Updated all components to use Tailwind classes
- ThemeContext updated to support Tailwind dark mode

### Known Issues
- Using placeholder/sample messages (not persistent)
- No real-time messaging (UI only)
- No OpenCode integration yet

### Next Steps
- Phase 2: localStorage Backend
