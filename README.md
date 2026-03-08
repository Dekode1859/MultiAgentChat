# MultiAgentChat

A React web application featuring a group chat interface for multiple AI agents, with real-time collaboration between an orchestrator (Jarvis), coding agents (Prometheus, Dekode), and the user.

## What is This Project?

MultiAgentChat is a template/demo application that simulates a multi-agent AI chat environment. It demonstrates how different AI agents can collaborate in a group chat setting—where one agent serves as an orchestrator, others handle specific tasks (like code execution), and the user interacts with the group.

The deployed application runs as a single-user private instance, while the code itself is open-source and designed as a template for developers who want to build similar multi-agent chat interfaces.

## Features

- **Multi-Agent Chat Interface** — Group chat UI where multiple AI agents participate in conversations simultaneously
- **Agent Filtering** — Filter messages by specific agent to focus on relevant conversations
- **Dark Mode** — Toggle between light and dark themes for comfortable viewing
- **Agent Avatars** — Visual distinction between agents with color-coded avatars and glow effects
- **OpenCode Integration Ready** — Architecture designed for integrating OpenCode as a coding agent (execution engine)
- **Responsive Design** — Works on desktop and tablet screen sizes

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Header  │  │ ChatArea │  │Message   │  │ InputArea│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  localStorage (Frontend State)               │
│              Messages, Theme, Agent Filter                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Future)
┌─────────────────────────────────────────────────────────────┐
│                    OpenCode Execution Engine                 │
│              Code execution & agent orchestration            │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 18 + Vite for fast development and builds
- **Styling**: CSS with CSS variables for theming (designed for Tailwind/shadcn/ui migration)
- **State Management**: React Context API for theme and message state
- **Storage**: localStorage for persisting messages and preferences
- **Execution**: OpenCode integration for code execution and agent responses

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd MultiAgentChat

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Deployment

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Start container
npm run docker:up

# Stop container
npm run docker:down
```

The Docker setup includes an Nginx server configured to serve the production build.

### Cloudflare Tunnel (Recommended for Private Access)

For single-user private access without configuring DNS:

1. Install Cloudflare Tunnel:

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared
```

2. Authenticate and create a tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create multiagent-chat
```

3. Create a config file at `~/.cloudflared/config.yml`:

```yaml
tunnel: <your-tunnel-id>
credentials-file: /root/.cloudflared/<your-tunnel-id>.json

ingress:
  - hostname: your-subdomain.example.com
    service: http://localhost:8080
  - service: http_status:404
```

4. Update `docker-compose.yml` to use the tunnel or run:

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml
```

5. Point your DNS to the tunnel:

```bash
cloudflared tunnel route dns multiagent-chat your-subdomain.example.com
```

### Manual Server Deployment

1. Build the project: `npm run build`
2. Copy `dist/` contents to your server's web root
3. Configure Nginx to serve the static files
4. Set up SSL with Let's Encrypt or your preferred provider

## Project Structure

```
MultiAgentChat/
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx      # App header with theme toggle & filters
│   │   ├── ChatArea.jsx   # Main chat container
│   │   ├── Message.jsx    # Individual message component
│   │   ├── Message.css    # Message styling
│   │   ├── InputArea.jsx  # Message input form
│   │   └── AgentAvatar.jsx # Agent avatar component
│   ├── context/
│   │   └── ThemeContext.jsx # Dark/light theme provider
│   ├── data/
│   │   └── sampleMessages.js # Demo messages & agent definitions
│   ├── utils/
│   │   └── timeFormat.js  # Timestamp formatting utilities
│   ├── App.jsx            # Main application component
│   ├── App.css            # App-level styles
│   ├── index.css          # Global styles & CSS variables
│   └── main.jsx           # React entry point
├── public/
│   └── favicon.svg        # App favicon
├── index.html             # HTML entry point
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite configuration
├── Dockerfile             # Docker image definition
├── nginx.conf             # Nginx configuration for Docker
└── SPEC.md                # Project specification
```

## Future Planned Features

### Phase 1: UI Enhancement
- Add shadcn/ui component library
- Implement sidebar navigation component
- Migrate from custom CSS to Tailwind CSS

### Phase 2: Data Persistence
- Implement localStorage backend for messages
- Save/restore conversation history
- Theme preference persistence

### Phase 3: Real Messaging System
- WebSocket connection for real-time messages
- Message queuing system
- Agent response simulation

### Phase 4: OpenCode Integration
- Stream responses from OpenCode execution engine
- Code block rendering with syntax highlighting
- Execute code snippets from chat

---

## Credits

- **UI Design**: Inspired by modern chat applications and developer tools
- **Icons**: Using Lucide React icons
- **Fonts**: Inter (UI) and JetBrains Mono (code) from Google Fonts

## License

This project is provided as a template. Feel free to use, modify, and distribute as needed for your own projects.
