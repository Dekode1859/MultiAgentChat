export const agents = {
  jarvis: {
    id: 'jarvis',
    name: 'Jarvis',
    color: '#58a6ff',
    glow: 'rgba(88, 166, 255, 0.4)',
    initial: 'J'
  },
  dekode: {
    id: 'dekode',
    name: 'Dekode',
    color: '#7ee787',
    glow: 'rgba(126, 231, 135, 0.4)',
    initial: 'D'
  },
  prometheus: {
    id: 'prometheus',
    name: 'Prometheus',
    color: '#f778ba',
    glow: 'rgba(247, 120, 186, 0.4)',
    initial: 'P'
  },
  user: {
    id: 'user',
    name: 'You',
    color: '#ffa657',
    glow: 'rgba(255, 166, 87, 0.4)',
    initial: 'U'
  }
}

export const initialMessages = [
  {
    id: 1,
    agentId: 'jarvis',
    content: "Initializing systems. How may I assist you today?",
    timestamp: "2026-03-08T10:00:00"
  },
  {
    id: 2,
    agentId: 'dekode',
    content: "Analysis complete. Ready for complex queries.",
    timestamp: "2026-03-08T10:01:30"
  },
  {
    id: 3,
    agentId: 'prometheus',
    content: "Planning and execution module online. What shall we build?",
    timestamp: "2026-03-08T10:02:15"
  },
  {
    id: 4,
    agentId: 'user',
    content: "Show me the project structure",
    timestamp: "2026-03-08T10:03:00"
  },
  {
    id: 5,
    agentId: 'jarvis',
    content: "Scanning directory structure...\n\nMultiAgentChat/\n├── src/\n│   ├── components/\n│   ├── context/\n│   ├── data/\n│   └── utils/\n├── public/\n├── package.json\n└── SPEC.md",
    timestamp: "2026-03-08T10:03:45"
  },
  {
    id: 6,
    agentId: 'dekode',
    content: "The structure looks clean. React with Vite for fast builds.",
    timestamp: "2026-03-08T10:04:20"
  },
  {
    id: 7,
    agentId: 'prometheus',
    content: "I can help you add Docker support. Want me to create a Dockerfile?",
    timestamp: "2026-03-08T10:05:00"
  }
]
