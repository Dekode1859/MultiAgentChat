import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { agents } from '../data/sampleMessages'
import './Header.css'

const agentTabs = [
  { id: 'all', name: 'All' },
  { id: 'jarvis', name: 'Jarvis' },
  { id: 'dekode', name: 'Dekode' },
  { id: 'prometheus', name: 'Prometheus' }
]

export function Header({ activeFilter, onFilterChange }) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className="header">
      <div className="header__title">
        <span className="header__icon">🤖</span>
        <h1>Multi-Agent Chat</h1>
      </div>
      
      <nav className="header__tabs">
        {agentTabs.map(tab => (
          <button
            key={tab.id}
            className={`header__tab ${activeFilter === tab.id ? 'header__tab--active' : ''}`}
            onClick={() => onFilterChange(tab.id)}
            style={activeFilter === tab.id && tab.id !== 'all' ? { 
              borderBottomColor: agents[tab.id]?.color 
            } : {}}
          >
            {tab.name}
          </button>
        ))}
      </nav>
      
      <button 
        className="header__theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  )
}
