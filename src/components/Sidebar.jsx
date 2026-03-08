import { useState } from 'react'
import { MessageSquare, Plus, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { agents } from '@/data/sampleMessages'

export function Sidebar({ className, activeFilter, onFilterChange }) {
  const [collapsed, setCollapsed] = useState(false)

  const agentList = [
    { id: 'all', name: 'All Messages', icon: Users, color: '#8b949e' },
    { id: 'jarvis', name: 'Jarvis', color: agents.jarvis.color },
    { id: 'dekode', name: 'Dekode', color: agents.dekode.color },
    { id: 'prometheus', name: 'Prometheus', color: agents.prometheus.color },
    { id: 'user', name: 'You', color: agents.user.color },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg">Conversations</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {agentList.map((agent) => {
            const isActive = activeFilter === agent.id
            const Icon = agent.icon || AvatarFallback

            return (
              <Button
                key={agent.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => onFilterChange(agent.id)}
              >
                {agent.id === 'all' ? (
                  <Icon className="h-5 w-5 shrink-0" style={{ color: agent.color }} />
                ) : (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ backgroundColor: agent.color, color: '#000' }}
                    >
                      {agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                {!collapsed && (
                  <span className="truncate">{agent.name}</span>
                )}
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-5 w-5" />
          {!collapsed && <span>New Chat</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  )
}
