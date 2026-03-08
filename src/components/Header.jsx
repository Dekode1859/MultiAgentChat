import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { agents } from '../data/sampleMessages'
import { Sun, Moon, Bot } from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

const agentTabs = [
  { id: 'all', name: 'All' },
  { id: 'jarvis', name: 'Jarvis' },
  { id: 'dekode', name: 'Dekode' },
  { id: 'prometheus', name: 'Prometheus' }
]

export function Header({ activeFilter, onFilterChange }) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold">Multi-Agent Chat</h1>
      </div>
      
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="hidden md:flex">
        <TabsList>
          {agentTabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className={activeFilter === tab.id && tab.id !== 'all' ? 'border-b-2' : ''}
              style={activeFilter === tab.id && tab.id !== 'all' ? { 
                borderBottomColor: agents[tab.id]?.color 
              } : {}}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </header>
  )
}
